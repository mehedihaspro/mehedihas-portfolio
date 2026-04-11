/* eslint-disable no-console */
/**
 * One-shot migration: convert post.category (string) into real
 * `category` document references.
 *
 * Before running:
 *   1. Make sure you've deployed the new schema (next build / next dev
 *      picks it up from src/sanity/schemas/category.ts).
 *   2. Create a write token at https://manage.sanity.io/projects/hr2g1fhi/api#tokens
 *      with "Editor" or higher permissions.
 *   3. Export it into your shell:
 *        export SANITY_WRITE_TOKEN=sk...
 *
 * Run it:
 *   npx tsx scripts/migrate-categories.ts
 *
 * What it does, in order:
 *   1. Scans every post's existing `category` field (both strings and
 *      pre-migrated references are handled — the script is idempotent).
 *   2. Collects every unique category title referenced by any post.
 *   3. For each unique title, looks up an existing `category` document
 *      by title. If not found, creates one with a slugified slug.
 *   4. Patches each post to replace the string `category` with a
 *      reference to the matching category document.
 *   5. Prints a summary so you can verify.
 *
 * Safe to re-run: a second run is a no-op because posts already point
 * at references.
 */

// next-sanity re-exports @sanity/client, so we don't need a separate dep.
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hr2g1fhi";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "[migrate] Missing SANITY_WRITE_TOKEN. Create one at\n" +
      `  https://manage.sanity.io/projects/${projectId}/api#tokens\n` +
      "and export it before running:\n" +
      "  export SANITY_WRITE_TOKEN=sk...\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}

interface LegacyPost {
  _id: string;
  category: string | { _ref: string } | null;
}

interface CategoryDoc {
  _id: string;
  title: string;
}

async function main() {
  console.log(
    `[migrate] Starting. project=${projectId} dataset=${dataset}`
  );

  // 1. Pull every post with its current category field
  const posts: LegacyPost[] = await client.fetch(
    `*[_type == "post"]{ _id, category }`
  );

  console.log(`[migrate] Found ${posts.length} posts`);

  // 2. Collect unique string categories (posts already referencing
  //    category documents are skipped — idempotent re-run safe)
  const stringCategories = new Set<string>();
  const postsToUpdate: Array<{ _id: string; title: string }> = [];

  for (const post of posts) {
    if (typeof post.category === "string") {
      const trimmed = post.category.trim();
      if (trimmed) {
        stringCategories.add(trimmed);
        postsToUpdate.push({ _id: post._id, title: trimmed });
      }
    }
    // If post.category is already a reference ({ _ref: ... }), leave it alone.
  }

  console.log(
    `[migrate] Found ${stringCategories.size} unique string categories:`,
    [...stringCategories]
  );
  console.log(`[migrate] ${postsToUpdate.length} posts need patching`);

  if (postsToUpdate.length === 0) {
    console.log("[migrate] Nothing to do. All posts already use references.");
    return;
  }

  // 3. Fetch existing category documents so we don't duplicate
  const existingCategories: CategoryDoc[] = await client.fetch(
    `*[_type == "category"]{ _id, title }`
  );
  const titleToId = new Map(
    existingCategories.map((c) => [c.title, c._id] as const)
  );

  // 4. Create missing category documents
  for (const title of stringCategories) {
    if (titleToId.has(title)) continue;
    const slug = slugify(title);
    const created = await client.create({
      _type: "category",
      title,
      slug: { _type: "slug", current: slug },
    });
    titleToId.set(title, created._id);
    console.log(`[migrate]   ✓ created category "${title}" → ${created._id}`);
  }

  // 5. Patch each post to point `category` at the matching doc
  for (const { _id, title } of postsToUpdate) {
    const categoryId = titleToId.get(title);
    if (!categoryId) {
      console.warn(`[migrate]   ✗ no category id for "${title}" (skipping ${_id})`);
      continue;
    }
    await client
      .patch(_id)
      .set({
        category: {
          _type: "reference",
          _ref: categoryId,
        },
      })
      .commit();
    console.log(
      `[migrate]   ✓ patched post ${_id} → category=${title} (${categoryId})`
    );
  }

  console.log("[migrate] Done. Review your posts in Studio to confirm.");
}

main().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});

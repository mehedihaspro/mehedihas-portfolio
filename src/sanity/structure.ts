import type { StructureResolver } from "sanity/structure";
import {
  FileText,
  Briefcase,
  Mail,
  User,
  Info,
  GraduationCap,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * Custom Sanity Studio desk structure.
 *
 * Groups document types into logical buckets so editors can find what they
 * need quickly:
 *
 *   Content     → Blog Posts, Case Studies, Newsletter Issues
 *   Site        → About Page, Workshops
 *   People      → Author
 *
 * All groups render as real document lists, not forced-ID singletons —
 * that way existing documents with arbitrary IDs still show up.
 */

// Lucide icons render fine in Sanity Studio 3.
const icon = (Component: ComponentType): ComponentType => Component;

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ─── Content ───────────────────────────────────────────────
      S.listItem()
        .title("Blog Posts")
        .icon(icon(FileText))
        .child(
          S.documentTypeList("post")
            .title("Blog Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Case Studies")
        .icon(icon(Briefcase))
        .child(
          S.documentTypeList("project")
            .title("Case Studies")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Newsletter Issues")
        .icon(icon(Mail))
        .child(
          S.documentTypeList("newsletterIssue").title("Newsletter Issues")
        ),

      S.divider(),

      // ─── Site content ──────────────────────────────────────────
      S.listItem()
        .title("About Page")
        .icon(icon(Info))
        .child(S.documentTypeList("about").title("About Page")),
      S.listItem()
        .title("Workshops")
        .icon(icon(GraduationCap))
        .child(S.documentTypeList("workshop").title("Workshops")),

      S.divider(),

      // ─── People ────────────────────────────────────────────────
      S.listItem()
        .title("Author")
        .icon(icon(User))
        .child(S.documentTypeList("author").title("Author")),
    ]);

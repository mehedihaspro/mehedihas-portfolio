import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Display name (e.g. 'Design System', 'UX Psychology').",
      validation: (rule) =>
        rule.required().error("Category title is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 64,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 64),
      },
      description:
        "Used in URLs (e.g. /blog/category/design-system). Auto-generated from title — edit only if you know what you're doing.",
      validation: (rule) =>
        rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Optional one-line blurb shown on category pages and in listings.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled category",
      subtitle: subtitle || "No description",
    }),
  },
  orderings: [
    {
      title: "Title, A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});

import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "currently", title: "Currently" },
    { name: "skills", title: "What I Do" },
    { name: "journey", title: "Journey" },
    { name: "inspired", title: "Inspired By" },
    { name: "memories", title: "Memories" },
  ],
  fields: [
    // ============================================
    // HERO
    // ============================================
    defineField({
      name: "heroTitle",
      title: "Page Title",
      type: "string",
      initialValue: "Hey, I'm Mehedi",
      group: "hero",
    }),
    defineField({
      name: "heroParagraph",
      title: "Hero Paragraph (Large)",
      type: "text",
      rows: 4,
      description: "The big light-weight paragraph",
      group: "hero",
    }),
    defineField({
      name: "bioParagraphs",
      title: "Bio Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "Shorter follow-up paragraphs",
      group: "hero",
    }),

    // ============================================
    // CURRENTLY
    // ============================================
    defineField({
      name: "currentlyItems",
      title: "Currently Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "currentlyItem",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. Designing, Reading, Watching",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "What",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description:
                "Lucide icon name: palette, bookopen, sparkles, headphones, coffee, tv, gamepad, film, music, pencil",
            }),
            defineField({
              name: "color",
              title: "Accent Color (hex)",
              type: "string",
              description: "e.g. #E8A832",
            }),
            defineField({
              name: "link",
              title: "Optional Link",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      group: "currently",
    }),

    // ============================================
    // WHAT I DO
    // ============================================
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          name: "skill",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Name (Lucide)",
              type: "string",
              description: "e.g. layers, pentool, users, mic",
            }),
            defineField({
              name: "shortDescription",
              title: "Short Description",
              type: "text",
              rows: 2,
              description: "Shown on the row itself",
            }),
            defineField({
              name: "tags",
              title: "Tags",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "fullDescription",
              title: "Full Description (Modal)",
              type: "array",
              of: [{ type: "block" }],
              description: "Detailed content shown when clicked",
            }),
            defineField({
              name: "tools",
              title: "Tools I Use",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "yearsOfExperience",
              title: "Years of Experience",
              type: "string",
            }),
            defineField({
              name: "projectsDelivered",
              title: "Projects Delivered",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "shortDescription" },
          },
        },
      ],
      group: "skills",
    }),

    // ============================================
    // JOURNEY
    // ============================================
    defineField({
      name: "journeyItems",
      title: "Journey Milestones",
      type: "array",
      of: [
        {
          type: "object",
          name: "journeyItem",
          fields: [
            defineField({
              name: "year",
              title: "Year",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "company",
              title: "Company / Context",
              type: "string",
            }),
            defineField({
              name: "chapter",
              title: "Chapter Name",
              type: "string",
              description: "e.g. The Beginning, The Turning Point",
            }),
            defineField({
              name: "story",
              title: "The Story",
              type: "text",
              rows: 5,
              description: "Personal narrative of this moment",
            }),
            defineField({
              name: "lessons",
              title: "What I Learned",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "quote",
              title: "Personal Quote",
              type: "text",
              rows: 2,
              description: "A reflective quote about this moment",
            }),
            defineField({
              name: "color",
              title: "Theme Color",
              type: "string",
              description: "Hex color for this chapter",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "year" },
          },
        },
      ],
      group: "journey",
    }),

    // ============================================
    // INSPIRED BY (Hobby)
    // ============================================
    defineField({
      name: "inspiredSection",
      title: "Inspired By Section",
      type: "object",
      group: "inspired",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          initialValue: "Inspired By",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
          description: "Short intro",
        }),
        defineField({
          name: "categories",
          title: "Categories",
          type: "array",
          of: [
            {
              type: "object",
              name: "inspiredCategory",
              fields: [
                defineField({
                  name: "type",
                  title: "Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Music", value: "music" },
                      { title: "Book", value: "book" },
                      { title: "Film", value: "film" },
                      { title: "Series", value: "series" },
                      { title: "Podcast", value: "podcast" },
                      { title: "Game", value: "game" },
                    ],
                  },
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "creator",
                  title: "Creator / Artist",
                  type: "string",
                }),
                defineField({
                  name: "coverImage",
                  title: "Cover Image",
                  type: "image",
                }),
                defineField({
                  name: "coverColor",
                  title: "Cover Color (fallback)",
                  type: "string",
                }),
                defineField({
                  name: "note",
                  title: "Why It Inspires Me",
                  type: "text",
                  rows: 2,
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "type" },
              },
            },
          ],
        }),
      ],
    }),

    // ============================================
    // MEMORIES
    // ============================================
    defineField({
      name: "memories",
      title: "Memories",
      type: "array",
      of: [
        {
          type: "object",
          name: "memory",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption (handwritten)",
              type: "string",
            }),
            defineField({
              name: "story",
              title: "Full Story",
              type: "text",
              rows: 4,
              description: "Shown when polaroid is clicked",
            }),
            defineField({
              name: "date",
              title: "Date",
              type: "string",
              description: "e.g. March 2024",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "color",
              title: "Cover Color (fallback)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "caption" },
          },
        },
      ],
      group: "memories",
    }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare: ({ title }) => ({
      title: title || "About Page",
    }),
  },
});

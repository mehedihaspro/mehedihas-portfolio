import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "problem", title: "Problem Space" },
    { name: "solution", title: "Solution Space" },
    { name: "outcome", title: "Outcome & Learning" },
    { name: "media", title: "Media" },
  ],
  fields: [
    // ============================================
    // OVERVIEW GROUP
    // ============================================
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Conversational title + hook (e.g. 'Redesigning how 10,000 patients book appointments')",
      validation: (rule) => rule.required(),
      group: "overview",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      group: "overview",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 4,
      description: "2-3 sentence storytelling paragraph. What the product is, who it's for, what was at stake.",
      group: "overview",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Specific role (e.g. 'Lead UX designer, end-to-end')",
      group: "overview",
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "string",
      description: "Names/initials + roles",
      group: "overview",
    }),
    defineField({
      name: "outcomeStatus",
      title: "Outcome Status",
      type: "string",
      description: "What happened: shipped, approved, in progress, shelved",
      group: "overview",
    }),
    defineField({
      name: "contribution",
      title: "Contribution",
      type: "text",
      rows: 3,
      description: "One honest callout: what % of the work was yours and in what areas. This is what recruiters read first.",
      group: "overview",
    }),
    defineField({
      name: "tags",
      title: "Tags / Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Industry/platform keywords (e.g. healthcare, B2B SaaS, mobile, fintech)",
      group: "overview",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "client",
      title: "Client / Company",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      group: "overview",
    }),

    // ============================================
    // PROBLEM SPACE GROUP
    // ============================================
    defineField({
      name: "problemImages",
      title: "Problem Space Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) =>
                rule.required().error("Alt text is required"),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
      description:
        "Current state screens, research artifacts, user journey maps, whiteboard photos. Landscape 16:10 preferred.",
      group: "problem",
    }),
    defineField({
      name: "research",
      title: "Research",
      type: "array",
      of: [{ type: "block" }],
      description: "Key finding first, then explain how you got there. Include key findings and research approach.",
      group: "problem",
    }),
    defineField({
      name: "planning",
      title: "Planning",
      type: "array",
      of: [{ type: "block" }],
      description: "What framework/approach guided the work, key decisions before design started, constraints.",
      group: "problem",
    }),

    // ============================================
    // SOLUTION SPACE GROUP
    // ============================================
    defineField({
      name: "solutionImages",
      title: "Solution Space Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) =>
                rule.required().error("Alt text is required"),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
      description:
        "Final screens, prototypes, key flows, before/after comparisons. Landscape 16:10 preferred.",
      group: "solution",
    }),
    defineField({
      name: "solutions",
      title: "Solutions",
      type: "array",
      of: [
        {
          type: "object",
          name: "designDecision",
          title: "Design Decision",
          fields: [
            defineField({
              name: "label",
              title: "Decision Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              description: "1-2 sentences: what the decision was + why + what happened",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "description" },
          },
        },
      ],
      description: "3-5 specific design decisions, each as a mini-story",
      group: "solution",
    }),
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      of: [
        {
          type: "object",
          name: "challenge",
          title: "Challenge",
          fields: [
            defineField({
              name: "name",
              title: "Challenge Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "How it was handled",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        },
      ],
      group: "solution",
    }),

    // ============================================
    // OUTCOME & LEARNING GROUP
    // ============================================
    defineField({
      name: "detailedOutcome",
      title: "Detailed Outcome",
      type: "array",
      of: [{ type: "block" }],
      description: "Overall result: what shipped, what the client/team said. Include metrics or qualitative results.",
      group: "outcome",
    }),
    defineField({
      name: "learning",
      title: "Learning",
      type: "text",
      rows: 4,
      description: "2-3 sentences. First person. Direct. What you'd do differently or what grew from this.",
      group: "outcome",
    }),
    defineField({
      name: "whatsNext",
      title: "What's Next",
      type: "text",
      rows: 3,
      description: "Only if the project is ongoing. What's happening now and what's planned. Leave empty if project shipped.",
      group: "outcome",
    }),

    // ============================================
    // MEDIA GROUP
    // ============================================
    defineField({
      name: "thumbnail",
      title: "Thumbnail / Cover Image",
      type: "image",
      options: { hotspot: true },
      description:
        "The visual anchor. First thing a recruiter sees. Landscape 16:10 recommended, target 1600×1000.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Alt text is required"),
        }),
      ],
      group: "media",
    }),
    defineField({
      name: "coverColor",
      title: "Cover Color (fallback)",
      type: "string",
      description: "Hex color for card if no thumbnail (e.g. #2D5F2D)",
      group: "media",
    }),

    // Sort order
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first on the Work page",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "role",
      media: "thumbnail",
    },
  },
});

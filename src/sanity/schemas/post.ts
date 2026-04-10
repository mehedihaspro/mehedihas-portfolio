import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata" },
    { name: "audio", title: "Audio" },
    { name: "references", title: "References & Fact Check" },
    { name: "quiz", title: "Quiz" },
    { name: "related", title: "Related" },
  ],
  fields: [
    // ============================================
    // CONTENT GROUP
    // ============================================
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Shown on blog index cards (max ~200 chars)",
      group: "content",
    }),
    defineField({
      name: "summary",
      title: "Hero Summary",
      type: "text",
      rows: 3,
      description:
        "Longer intro paragraph shown below the title (with amber accent bar)",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              { title: "Highlight", value: "highlight" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
              {
                name: "internalLink",
                type: "object",
                title: "Internal Link",
                fields: [
                  {
                    name: "reference",
                    type: "reference",
                    title: "Reference",
                    to: [{ type: "post" }],
                  },
                ],
              },
              {
                name: "footnote",
                type: "object",
                title: "Footnote Reference",
                fields: [
                  {
                    name: "number",
                    type: "number",
                    title: "Reference number",
                  },
                ],
              },
            ],
          },
        },
        // Image block
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "fullWidth",
              title: "Full Width",
              type: "boolean",
              description: "Break out of content width",
              initialValue: false,
            }),
          ],
        },
        // Pull quote
        {
          type: "object",
          name: "pullQuote",
          title: "Pull Quote",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "citation",
              title: "Citation",
              type: "string",
              description: "e.g. — Author Name",
            }),
          ],
          preview: {
            select: { title: "quote", subtitle: "citation" },
          },
        },
        // Code block
        {
          type: "object",
          name: "codeBlock",
          title: "Code Block",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              options: {
                list: [
                  "javascript",
                  "typescript",
                  "jsx",
                  "tsx",
                  "html",
                  "css",
                  "scss",
                  "json",
                  "python",
                  "bash",
                  "markdown",
                  "sql",
                ],
              },
              initialValue: "javascript",
            }),
            defineField({
              name: "code",
              title: "Code",
              type: "text",
              rows: 10,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "filename",
              title: "Filename (optional)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "filename", subtitle: "language" },
          },
        },
        // Video embed
        {
          type: "object",
          name: "videoEmbed",
          title: "Video Embed",
          fields: [
            defineField({
              name: "url",
              title: "Video URL",
              type: "url",
              description: "YouTube, Vimeo, or direct video link",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
        // Callout / Note
        {
          type: "object",
          name: "callout",
          title: "Callout / Note",
          fields: [
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Info", value: "info" },
                  { title: "Warning", value: "warning" },
                  { title: "Tip", value: "tip" },
                  { title: "Note", value: "note" },
                ],
              },
              initialValue: "note",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
        },
        // Divider
        {
          type: "object",
          name: "divider",
          title: "Divider",
          fields: [
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Line", value: "line" },
                  { title: "Decorative (✻)", value: "decorative" },
                  { title: "Dots", value: "dots" },
                ],
              },
              initialValue: "decorative",
            }),
          ],
        },
      ],
      group: "content",
    }),

    // ============================================
    // META GROUP
    // ============================================
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "UX Psychology", value: "UX Psychology" },
          { title: "Design Psychology", value: "Design Psychology" },
          { title: "Design System", value: "Design System" },
          { title: "UX Design", value: "UX Design" },
          { title: "Visual Design", value: "Visual Design" },
          { title: "Career", value: "Career" },
          { title: "Product Design", value: "Product Design" },
          { title: "Content", value: "Content" },
        ],
      },
      validation: (rule) => rule.required(),
      group: "meta",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "meta",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Bangla", value: "BANGLA" },
          { title: "English", value: "ENGLISH" },
        ],
      },
      initialValue: "BANGLA",
      group: "meta",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
      group: "meta",
    }),
    defineField({
      name: "coverColor",
      title: "Cover Color (fallback)",
      type: "string",
      description: "Hex color for card cover if no image (e.g. #2D5F2D)",
      group: "meta",
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "string",
      description: "e.g. 8 min read",
      group: "meta",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
      group: "meta",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      group: "meta",
    }),

    // ============================================
    // AUDIO GROUP
    // ============================================
    defineField({
      name: "enableAudio",
      title: "Enable Audio Narration",
      type: "boolean",
      description: "Generate audio via Google TTS",
      initialValue: false,
      group: "audio",
    }),
    defineField({
      name: "audioUrlFemale",
      title: "Female Voice Audio URL",
      type: "url",
      description: "Auto-generated. Leave empty to regenerate.",
      group: "audio",
    }),
    defineField({
      name: "audioUrlMale",
      title: "Male Voice Audio URL",
      type: "url",
      description: "Auto-generated. Leave empty to regenerate.",
      group: "audio",
    }),
    defineField({
      name: "audioDuration",
      title: "Audio Duration",
      type: "string",
      description: "e.g. 8:32",
      group: "audio",
    }),

    // ============================================
    // REFERENCES & FACT CHECK GROUP
    // ============================================
    defineField({
      name: "references",
      title: "References (তথ্যসূত্র)",
      type: "array",
      of: [
        {
          type: "object",
          name: "citationItem",
          title: "Citation",
          fields: [
            defineField({
              name: "title",
              title: "Title / Source",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "author",
              title: "Author",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
            defineField({
              name: "publication",
              title: "Publication / Journal",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "author" },
          },
        },
      ],
      group: "references",
    }),
    defineField({
      name: "factChecks",
      title: "Fact Check Report",
      type: "array",
      of: [
        {
          type: "object",
          name: "factCheck",
          fields: [
            defineField({
              name: "claim",
              title: "Claim",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Verified", value: "verified" },
                  { title: "Partially True", value: "partial" },
                  { title: "Needs Context", value: "context" },
                  { title: "Disputed", value: "disputed" },
                ],
              },
              initialValue: "verified",
            }),
            defineField({
              name: "source",
              title: "Source",
              type: "string",
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "claim", subtitle: "status" },
          },
        },
      ],
      group: "references",
    }),

    // ============================================
    // QUIZ GROUP
    // ============================================
    defineField({
      name: "quiz",
      title: "Quiz",
      type: "object",
      group: "quiz",
      description:
        "Optional end-of-article quiz. Readers can test comprehension and share their score.",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable Quiz",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "title",
          title: "Quiz Title",
          type: "string",
          description: "e.g. 'Test your understanding'",
          initialValue: "Test your understanding",
        }),
        defineField({
          name: "description",
          title: "Intro Description",
          type: "text",
          rows: 2,
          description: "Shown on the start card before the reader begins",
        }),
        defineField({
          name: "questions",
          title: "Questions",
          type: "array",
          validation: (rule) => rule.min(3).max(10),
          of: [
            {
              type: "object",
              name: "quizQuestion",
              title: "Question",
              fields: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "text",
                  rows: 2,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "options",
                  title: "Options",
                  type: "array",
                  validation: (rule) => rule.min(2).max(6),
                  of: [
                    {
                      type: "object",
                      name: "quizOption",
                      fields: [
                        defineField({
                          name: "text",
                          title: "Answer Text",
                          type: "string",
                          validation: (rule) => rule.required(),
                        }),
                        defineField({
                          name: "correct",
                          title: "Is correct?",
                          type: "boolean",
                          initialValue: false,
                        }),
                      ],
                      preview: {
                        select: { title: "text", correct: "correct" },
                        prepare({ title, correct }) {
                          return {
                            title: title || "Option",
                            subtitle: correct ? "✓ Correct" : "",
                          };
                        },
                      },
                    },
                  ],
                }),
                defineField({
                  name: "explanation",
                  title: "Explanation",
                  type: "text",
                  rows: 3,
                  description:
                    "Shown on the results screen to explain the answer",
                }),
                defineField({
                  name: "relatedSection",
                  title: "Related Section Slug (optional)",
                  type: "string",
                  description:
                    "The slug of a heading in the article (e.g. 'loss-aversion'). When the reader gets this wrong, they can jump to the related section.",
                }),
              ],
              preview: {
                select: { title: "question" },
              },
            },
          ],
        }),
      ],
    }),

    // ============================================
    // RELATED GROUP
    // ============================================
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (rule) => rule.max(3),
      group: "related",
    }),
  ],
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});

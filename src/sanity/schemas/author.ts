import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "avatar",
      title: "Avatar / Profile Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Square photo, 1:1 aspect ratio. Target 400×400 or larger. Shown as a circle in the blog byline and the About page hero.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "e.g. 'Mehedi Hasan portrait'",
          validation: (rule) =>
            rule.required().error("Alt text is required"),
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "twitter", title: "Twitter", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "dribbble", title: "Dribbble", type: "url" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
      ],
    }),
    defineField({
      name: "currentlyReading",
      title: "Currently Reading",
      type: "string",
    }),
    defineField({
      name: "currentlyDesigning",
      title: "Currently Designing",
      type: "string",
    }),
    defineField({
      name: "currentlyLearning",
      title: "Currently Learning",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "avatar",
    },
  },
});

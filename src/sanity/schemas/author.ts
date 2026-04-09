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
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
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

import { defineField, defineType } from "sanity";

export const workshop = defineType({
  name: "workshop",
  title: "Workshop",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Landscape 16:9 recommended. Target 1600×900 minimum.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Alt text is required"),
        }),
        defineField({
          name: "caption",
          title: "Caption (optional)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Ongoing", value: "ongoing" },
          { title: "Past", value: "past" },
        ],
      },
      initialValue: "upcoming",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g. Free, $49, etc.",
      initialValue: "Free",
    }),
    defineField({
      name: "enrollmentUrl",
      title: "Enrollment URL",
      type: "url",
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
      media: "coverImage",
    },
  },
});

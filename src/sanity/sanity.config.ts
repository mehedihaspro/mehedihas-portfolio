import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { apiVersion, dataset, projectId } from "./env";
import { deskStructure } from "./structure";

export default defineConfig({
  name: "mehedihas-studio",
  title: "mehedihas Portfolio",
  // Studio is mounted at /studio in the Next.js app. Sanity needs to know
  // so its client-side router and asset upload URLs resolve correctly.
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});

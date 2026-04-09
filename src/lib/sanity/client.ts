import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  // If you want to use the CDN for reads (faster, but slightly stale data):
  // useCdn: true,
});

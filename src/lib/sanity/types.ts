/**
 * Shared types for Sanity query responses that use the imageFragment in
 * `queries.ts`. Keep this in sync with that fragment.
 */

export interface SanityImage {
  url?: string;
  lqip?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  alt?: string;
  caption?: string;
}

import { groq } from "next-sanity";

// ============================================
// Reusable fragments
// ============================================

// Expand a Sanity image field into the asset URL + metadata. Returns the
// URL as the `url` property so the front-end can consume it directly.
const imageFragment = groq`{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  alt,
  caption
}`;

// ============================================
// Blog Post Queries
// ============================================

export const allPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    tags,
    language,
    "coverImage": coverImage${imageFragment},
    coverColor,
    readingTime,
    enableAudio,
    audioDuration,
    publishedAt,
    featured
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    category,
    "coverImage": coverImage${imageFragment},
    coverColor,
    readingTime,
    publishedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    summary,
    category,
    tags,
    language,
    "coverImage": coverImage${imageFragment},
    coverColor,
    body,
    readingTime,
    enableAudio,
    audioUrlFemale,
    audioUrlMale,
    audioDuration,
    publishedAt,
    featured,
    references,
    factChecks,
    quiz,
    "relatedPosts": relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      category,
      publishedAt,
      readingTime,
      "coverImage": coverImage${imageFragment},
      coverColor,
      language,
      enableAudio
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] { "slug": slug.current }
`;

// ============================================
// Project Queries
// ============================================

export const allProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    slug,
    overview,
    "thumbnail": thumbnail${imageFragment},
    coverColor,
    tags,
    client,
    role,
    year,
    liveUrl
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    overview,
    role,
    team,
    outcomeStatus,
    contribution,
    tags,
    year,
    client,
    liveUrl,
    "problemImages": problemImages[]${imageFragment},
    research,
    planning,
    "solutionImages": solutionImages[]${imageFragment},
    solutions,
    challenges,
    detailedOutcome,
    learning,
    whatsNext,
    "thumbnail": thumbnail${imageFragment},
    coverColor
  }
`;

// ============================================
// Workshop Queries
// ============================================

export const allWorkshopsQuery = groq`
  *[_type == "workshop" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    slug,
    description,
    "coverImage": coverImage${imageFragment},
    date,
    status,
    price,
    enrollmentUrl,
    capacity
  }
`;

export const upcomingWorkshopsQuery = groq`
  *[_type == "workshop" && status == "upcoming" && !(_id in path("drafts.**"))] | order(date asc) {
    _id,
    title,
    slug,
    description,
    date,
    price,
    enrollmentUrl,
    capacity
  }
`;

// ============================================
// Newsletter Queries
// ============================================

export const allNewsletterIssuesQuery = groq`
  *[_type == "newsletterIssue" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    summary,
    kitIssueUrl,
    publishedAt
  }
`;

// ============================================
// Author Query
// ============================================

export const authorQuery = groq`
  *[_type == "author"][0] {
    _id,
    name,
    bio,
    "avatar": avatar${imageFragment},
    socialLinks,
    currentlyReading,
    currentlyDesigning,
    currentlyLearning
  }
`;

// ============================================
// Category list (derived from posts)
// ============================================

export const categoriesQuery = groq`
  array::unique(*[_type == "post" && !(_id in path("drafts.**"))].category)
`;

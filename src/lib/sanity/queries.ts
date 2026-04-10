import { groq } from "next-sanity";

// ============================================
// Blog Post Queries
// ============================================

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    tags,
    coverImage,
    coverColor,
    readingTime,
    audioUrl,
    audioDuration,
    publishedAt,
    featured
  }
`;

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    category,
    coverImage,
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
    coverImage,
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
      coverColor,
      language,
      enableAudio
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post"] { "slug": slug.current }
`;

// ============================================
// Project Queries
// ============================================

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    overview,
    thumbnail,
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
    problemImages,
    research,
    planning,
    solutionImages,
    solutions,
    challenges,
    detailedOutcome,
    learning,
    whatsNext,
    thumbnail,
    coverColor
  }
`;

// ============================================
// Workshop Queries
// ============================================

export const allWorkshopsQuery = groq`
  *[_type == "workshop"] | order(date desc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    date,
    status,
    price,
    enrollmentUrl,
    capacity
  }
`;

export const upcomingWorkshopsQuery = groq`
  *[_type == "workshop" && status == "upcoming"] | order(date asc) {
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
  *[_type == "newsletterIssue"] | order(publishedAt desc) {
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
    avatar,
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
  array::unique(*[_type == "post"].category)
`;

export const publisherCategories = ["news", "youtube", "x", "sns"] as const

export type PublisherCategory = (typeof publisherCategories)[number]

export const snsPublisherMap: {
  [key in Exclude<PublisherCategory, "news">]: string[]
} = {
  x: ["x.com"],
  youtube: ["youtube"],
  sns: ["facebook", "tiktok", "instagram", "threads"],
} as const

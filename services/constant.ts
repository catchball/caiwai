export const publisherCategories = ["news", "youtube", "x", "sns"] as const

export type PublisherCategory = (typeof publisherCategories)[number]

export const snsPublisherMap: {
  [key in Exclude<PublisherCategory, "news">]: string[]
} = {
  x: ["x.com"],
  youtube: ["youtube"],
  sns: ["facebook", "tiktok", "instagram", "threads"],
} as const

export const publisherCategoriesWithLabel: {
  label: string
  value: PublisherCategory
}[] = [
  { label: "All", value: undefined },
  { label: "News", value: "news" },
  { label: "YouTube", value: "youtube" },
  { label: "X.com", value: "x" },
  { label: "Other SNS", value: "sns" },
] as const

export const compactPublisherCatetoriesWithLabel =
  publisherCategoriesWithLabel.filter((c) => !!c.value)

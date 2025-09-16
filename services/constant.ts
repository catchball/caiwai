export const publisherCategories = ["news", "youtube", "x", "sns"] as const

export type PublisherCategory = (typeof publisherCategories)[number]

export const snsPublisherMap: {
  [key in Exclude<PublisherCategory, "news">]: string[]
} = {
  x: ["x.com"],
  youtube: ["youtube"],
  sns: [
    "facebook",
    "tiktok",
    "instagram",
    "threads",
    "ニコニコチャンネル",
    "もぐナビ",
    "ツイコミ(仮)",
    "pixiv",
    "もぐナビ",
    "ニコニコ動画",
    "openrec.tv",
    "ニコニコ生放送",
    "ツイキャス",
    "tters",
    "はてな匿名ダイアリー",
    "アットコスメ",
    "もぐナビ",
    "readyfor",
    "価格.com",
    "yahoo!知恵袋",
    "カコモンズ",
    "教えて!goo",
    "lips",
    "holiday",
    "motiongallery",
    "楽天ブログ",
    "ameblo",
    "note",
    "Yahoo!ニュース エキスパート",
    "Zenn",
    "gooブログ",
    "ライブドアブログ",
  ],
} as const

export const publisherCategoriesWithLabel: {
  label: string
  value: PublisherCategory
}[] = [
  { label: "All", value: undefined },
  { label: "News", value: "news" },
  { label: "X", value: "x" },
  { label: "YouTube", value: "youtube" },
  { label: "Others", value: "sns" },
] as const

export const compactPublisherCatetoriesWithLabel =
  publisherCategoriesWithLabel.filter((c) => !!c.value)

import { ApiClient } from "@catchball/tansaku-client/lib"

const BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  ("https://api.saku2.reload.co.jp" as const)

export const api = new ApiClient({
  BASE,
})

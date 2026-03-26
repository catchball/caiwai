import { ApiClient } from "@catchball/tansaku-client/lib"
import { auth } from "./firebase"

const BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  ("https://api.saku2.reload.co.jp" as const)

export const api = new ApiClient({
  BASE,
  HEADERS: async () => {
    const token = await auth.currentUser?.getIdToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
})

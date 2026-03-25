import { atom } from "jotai"
import type { PrimitiveAtom } from "jotai"

export const loadingAtom = atom(false)
// undefined = 認証状態確認中, null = 未ログイン, object = ログイン済み
export const userAtom: PrimitiveAtom<object | null | undefined> = atom()

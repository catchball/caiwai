import { atom } from "jotai"
import type { User as FirebaseUser } from "firebase/auth"

export const loadingAtom = atom(false)
// undefined = 認証状態確認中, null = 未ログイン, object = ログイン済み
const initialUser: FirebaseUser | null | undefined = undefined
export const userAtom = atom(initialUser)

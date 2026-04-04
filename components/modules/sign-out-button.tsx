import { Button } from "components/elements/form"
import { signOut } from "firebase/auth"
import { useSetAtom } from "jotai"
import { FC } from "react"
import { auth } from "services/firebase"
import { userAtom } from "services/store"

export const SignOutButton: FC = () => {
  const setUser = useSetAtom(userAtom)
  const handleSignOut = async () => {
    window.localStorage.removeItem("emailForSignIn")
    setUser(undefined)
    await signOut(auth)
  }
  return (
    <Button onClick={handleSignOut} type="button">
      ログアウト
    </Button>
  )
}

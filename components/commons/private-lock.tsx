"use client"

import { sendSignInLinkToEmail } from "firebase/auth"
import { useAtomValue } from "jotai"
import { ComponentProps, FC, FormEvent, useState } from "react"
import { auth } from "services/firebase"
import { userAtom } from "services/store"
import { Button, Input } from "components/elements/form"

export const PrivateLock: FC<ComponentProps<"section">> = (props) => {
  const [email, setEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const user = useAtomValue(userAtom)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      await sendSignInLinkToEmail(auth, email, {
        handleCodeInApp: true,
        url: window.location.href,
      })
      window.localStorage.setItem("emailForSignIn", email)
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません")
    }
  }

  if (user === undefined) return null

  if (user) return <section {...props} />

  return (
    <section style={{ margin: "auto", maxWidth: "28rem", padding: "1rem" }}>
      <h3 style={{ textAlign: "center" }}>非公開ページ</h3>
      <p style={{ textAlign: "center" }}>
        アクセスするにはログインしてください
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexFlow: "column",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <Input
          type="email"
          value={email ?? ""}
          placeholder="メールアドレス"
          onChange={({ target: { value } }) => setEmail(value)}
        />
        {error && (
          <p style={{ color: "red", margin: 0, textAlign: "center" }}>
            {error}
          </p>
        )}
        <Button>ログイン</Button>
      </form>
    </section>
  )
}

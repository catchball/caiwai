"use client"

import { sendSignInLinkToEmail } from "firebase/auth"
import { useAtomValue } from "jotai"
import { ComponentProps, FC, SubmitEventHandler, useState } from "react"
import { auth } from "services/firebase"
import { userAtom } from "services/store"
import { Button, Input } from "components/elements/form"
import { Modal } from "./modal"

export const PrivateLock: FC<ComponentProps<"section">> = (props) => {
  const [email, setEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const [isSent, setIsSent] = useState<boolean>(false)
  const user = useAtomValue(userAtom)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError(undefined)
    try {
      await sendSignInLinkToEmail(auth, email, {
        handleCodeInApp: true,
        url: window.location.href,
      })
      window.localStorage.setItem("emailForSignIn", email)
      setIsSent(true)
    } catch {
      setError("認証エラー")
    }
  }

  if (user === undefined) return null

  if (user) return <section {...props} />

  return (
    <Modal isOpen={true}>
      <h3 style={{ textAlign: "center" }}>非公開ページ</h3>
      <p style={{ textAlign: "center" }}>
        アクセスするにはログインしてください
      </p>
      {isSent ? (
        <>
          <p>ログインメールを送信しました</p>
        </>
      ) : (
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
      )}
    </Modal>
  )
}

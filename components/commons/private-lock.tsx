"use client"

import { sendSignInLinkToEmail } from "firebase/auth"
import { useAtomValue, useSetAtom } from "jotai"
import { ComponentProps, FC, SubmitEventHandler, useState } from "react"
import { auth } from "services/firebase"
import { loadingAtom, userAtom } from "services/store"
import { Button, Input } from "components/elements/form"
import { Modal } from "./modal"
import Link from "next/link"

export const PrivateLock: FC<ComponentProps<"section">> = (props) => {
  const [email, setEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const [isSent, setIsSent] = useState<boolean>(false)
  const user = useAtomValue(userAtom)
  const setIsLoading = useSetAtom(loadingAtom)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  if (user) return <section {...props} />

  return (
    <>
      <Modal
        isOpen={true}
        style={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          maxWidth: "32rem",
        }}
      >
        <p style={{ padding: ".5rem", textAlign: "center" }}>Caiwai</p>
        <h2 style={{ textAlign: "center" }}>会員向けサービス</h2>

        {isSent ? (
          <>
            <p style={{ padding: "1rem", textAlign: "center" }}>
              ログインメールを送信しました
            </p>
          </>
        ) : (
          <>
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
                required
              />
              {error && (
                <p style={{ color: "red", margin: 0, textAlign: "center" }}>
                  {error}
                </p>
              )}
              <Button>ログイン</Button>
            </form>
          </>
        )}
        <Link
          href="/"
          style={{ display: "block", padding: "1rem", textAlign: "center" }}
        >
          トップに戻る
        </Link>
        <a
          href="//catchball.jp"
          style={{ display: "block", padding: "1rem", textAlign: "center" }}
        >
          問い合わせる
        </a>
      </Modal>
    </>
  )
}

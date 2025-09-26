"use client"

import { Button, Input } from "components/elements/form"
import { ComponentProps, FC, FormEvent, useEffect, useState } from "react"

const sha256 = async (text: string): Promise<string> => {
  const uint8 = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest("SHA-256", uint8)
  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
}

const PRIVATE_PASSWORD =
  "dd47336c9b06c5ac44325c1a22f14f8150b365a3184fc770be893b004a289b3e" as const

export const PrivateLock: FC<ComponentProps<"section">> = (props) => {
  const [password, setPassword] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
  const handleClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (await checkPassword(password)) {
      setIsAuthenticated(true)
      localStorage.setItem("private_password", password)
    }
  }
  const checkPassword = async (password: string) => {
    const hashed = await sha256(password)
    return hashed == PRIVATE_PASSWORD
  }
  useEffect(() => {
    const check = async () => {
      const password = localStorage.getItem("private_password")
      if (!password) return
      if (await checkPassword(password)) setIsAuthenticated(true)
    }
    check()
  }, [])
  return (
    <>
      {isAuthenticated == undefined ? null : isAuthenticated ? (
        <section {...props} />
      ) : (
        <section style={{ margin: "auto", maxWidth: "28rem", padding: "1rem" }}>
          <h3 style={{ textAlign: "center" }}>非公開ページ</h3>
          <p style={{ textAlign: "center" }}>
            アクセスするにはパスワードを入力してください
          </p>
          <form
            onSubmit={handleClick}
            style={{
              display: "flex",
              flexFlow: "column",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <Input
              type="password"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
            <Button>解除</Button>
          </form>
        </section>
      )}
    </>
  )
}

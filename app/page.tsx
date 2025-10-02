import React, { FC } from "react"

const MenuLink: FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
  ...props
}) => (
  <a
    href={href}
    style={{
      background: "#f0f0f0",
      border: "solid 1px #ccc",
      borderRadius: ".5rem",
      boxShadow: ".5rem .5rem .5rem rgba(0,0,0,.1)",
      padding: "1rem",
    }}
    {...props}
  >
    {children}
  </a>
)

const Page: FC = ({ ...props }) => {
  return (
    <React.Fragment {...props}>
      <div style={{ padding: 0 }}>
        <a
          href="//docs.google.com/presentation/d/19kgtO1xAhNhkH_rbMM5tKVgPyXwJj8Suhy32oZx0YdY/edit?usp=sharing"
          style={{
            alignItems: "center",
            background: "#f0f0f0",
            display: "flex",
            minHeight: "48rem",
            padding: "2rem 1rem",
          }}
        >
          <h2
            style={{
              color: "#222",
              fontSize: "3rem",
              fontWeight: "bolder",
            }}
          >
            界隈ごと、まるわかり。
          </h2>
        </a>
      </div>
      <div style={{ display: "flex", padding: "1rem" }}>
        <MenuLink href="//sites.google.com/catch-ball.co.jp/caiwai-magazinelist/">
          マガジンリストをみる
        </MenuLink>
      </div>
    </React.Fragment>
  )
}

export default Page

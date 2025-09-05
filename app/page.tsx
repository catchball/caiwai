import React, { FC } from "react"

const Page: FC = ({ ...props }) => {
  return (
    <React.Fragment {...props}>
      <div style={{ padding: 0 }}>
        <div
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
        </div>
      </div>
    </React.Fragment>
  )
}

export default Page

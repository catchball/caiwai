"use client"

import { useAtomValue } from "jotai"
import { FC } from "react"
import { loadingAtom } from "services/store"

export const Loading: FC = () => {
  const isLoading = useAtomValue(loadingAtom)

  if (!isLoading) return null
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #ccc",
              borderTop: "4px solid #333",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
            Loading...
          </p>
        </div>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    </>
  )
}

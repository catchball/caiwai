import { User } from "@catchball/tansaku-client/lib"
import { FC } from "react"

export const ProfileCard: FC<{ user: User }> = ({ user }) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#f9f9f9",
        borderRadius: ".5rem",
        display: "flex",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#444",
          borderRadius: "50%",
          color: "#fff",
          display: "flex",
          fontSize: "1.5rem",
          height: "3rem",
          justifyContent: "center",
          width: "3rem",
        }}
      >
        {user.name.charAt(0)}
      </div>
      <div style={{ display: "flex", flexFlow: "column", gap: ".125rem" }}>
        <div style={{ fontWeight: "bold" }}>{user.name}</div>
        <div style={{ color: "#999", fontSize: ".75rem" }}>{user.email}</div>
        {user.team && (
          <div style={{ color: "#666", fontSize: ".75rem" }}>
            {user.team.name}
          </div>
        )}
      </div>
    </div>
  )
}

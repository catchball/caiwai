import React, { ComponentProps, FC } from "react"

export const FilterButton: FC<
  ComponentProps<"button"> & { isActive: boolean }
> = ({ isActive, style, ...props }) => {
  return (
    <button
      {...props}
      style={{
        background: "#f9f9f9",
        border: "none",
        borderRadius: "1rem",
        cursor: "pointer",
        outline: isActive ? "dotted 2px #999" : "none",
        outlineOffset: "-3px",
        padding: ".5rem .75rem",
        ...style,
      }}
    ></button>
  )
}

export const Input: FC<ComponentProps<"input">> = ({ style, ...props }) => {
  return (
    <input style={{ border: "none", padding: ".25rem", ...style }} {...props} />
  )
}

export const Button: FC<ComponentProps<"button">> = ({ style, ...props }) => {
  return (
    <button
      style={{
        background: "#444",
        color: "#eee",
        border: "none",
        padding: ".25rem .5rem",
        ...style,
      }}
      {...props}
    />
  )
}

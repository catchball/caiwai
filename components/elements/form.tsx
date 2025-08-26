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

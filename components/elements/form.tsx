import React, { ComponentProps, FC } from "react"

export const FilterButton: FC<
  ComponentProps<"button"> & { isActive: boolean }
> = ({ isActive, style, ...props }) => {
  return (
    <button
      {...props}
      style={{
        background: isActive ? "#444" : "#f9f9f9",
        border: "none",
        borderRadius: "1rem",
        color: isActive ? "#eee" : "#444",
        cursor: "pointer",
        outline: "none",
        outlineOffset: "-3px",
        padding: ".5rem 1rem",
        ...style,
      }}
    ></button>
  )
}

export const Input: FC<ComponentProps<"input">> = ({ style, ...props }) => {
  return (
    <input
      style={{
        border: "none",
        borderRadius: ".25rem",
        padding: ".5rem 1rem",
        ...style,
      }}
      {...props}
    />
  )
}

export const Button: FC<ComponentProps<"button">> = ({ style, ...props }) => {
  return (
    <button
      style={{
        background: "#444",
        borderRadius: ".25rem",
        color: "#eee",
        cursor: "pointer",
        border: "none",
        padding: ".5rem 1rem",
        ...style,
      }}
      {...props}
    />
  )
}

export const CheckBox: FC<
  Omit<ComponentProps<"input">, "type"> & { label: string }
> = ({ label, style, checked, ...props }) => {
  return (
    <label
      style={{
        background: "#f9f9f9",
        border: "none",
        borderRadius: "1rem",
        color: "#444",
        cursor: "pointer",
        fontSize: ".5rem",
        height: "1.25rem",
        lineHeight: 2,
        outline: checked ? "solid 1px" : "none",
        padding: ".125rem .5rem",
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        style={{
          border: "none",
          display: "none",
          padding: ".25rem",
        }}
        {...props}
      />
      {label}
    </label>
  )
}

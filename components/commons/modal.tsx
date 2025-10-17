import type { FC, ComponentProps } from "react"

type ModalProps = { isOpen: boolean; onClose?: () => void }

export const Modal: FC<ComponentProps<"div"> & ModalProps> = ({
  children,
  isOpen,
  onClose,
  style,
  ...props
}: ComponentProps<"div"> & ModalProps) => {
  return (
    <>
      {isOpen && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100dvh",
            justifyContent: "center",
            left: 0,
            padding: "1rem",
            position: "fixed",
            top: 0,
            width: "100vw",
          }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              height: "100dvh",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100dvw",
            }}
            onClick={onClose}
            role="button"
            aria-hidden="true"
          />
          <div
            style={{
              background: "#f0f0f0",
              height: "95%",
              maxHeight: "64rem",
              maxWidth: "72rem",
              overflow: "scroll",
              padding: "1rem",
              width: "95%",
              zIndex: 2,
              ...style,
            }}
            {...props}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}

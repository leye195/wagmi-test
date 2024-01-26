"use client";

import { PropsWithChildren, useMemo } from "react";
import useMountTransition from "@/hooks/useMountTransition";
import Content from "./Content";

export type ModalProps = {
  allowCloseOnOutside?: boolean;
  backdrop?: "blur" | "transparent";
  className?: string;
  hideCloseButton?: boolean;
  isOpen: boolean;
  placement?: "center" | "bottom" | "auto";
  handleOpen: (isOpen: boolean) => void;
} & PropsWithChildren;

const Modal = ({
  children,
  isOpen,
  className = "",
  placement = "center",
  allowCloseOnOutside = false,
  hideCloseButton = false,
  backdrop = "transparent",
  handleOpen,
}: ModalProps) => {
  const isTransitioning = useMountTransition(isOpen, 100);

  const modalPosition = useMemo(() => {
    switch (placement) {
      case "bottom":
        return `items-end`;
      case "center":
        return "items-center";
      default:
        return "";
    }
  }, [placement]);

  if (!isOpen && !isTransitioning) return null;

  return (
    <div tabIndex={-1}>
      <div
        className={`fixed z-10 w-screen h-screen inset-0 ${
          backdrop === "blur"
            ? "backdrop-blur-md backdrop-saturate-150 bg-black/30"
            : "bg-transparent"
        }  transition-all`}
        style={{
          opacity: isTransitioning && isOpen ? 1 : 0,
        }}
      />
      <div
        className={`fixed z-10 w-screen h-[100dvh] inset-0 overflow-x-auto flex justify-center ${modalPosition}`}
      >
        <Content
          className={className}
          isOpen={isOpen && isTransitioning}
          allowCloseOnOutside={allowCloseOnOutside}
          hideCloseButton={hideCloseButton}
          handleOpen={handleOpen}
        >
          {children}
        </Content>
      </div>
    </div>
  );
};

export default Modal;

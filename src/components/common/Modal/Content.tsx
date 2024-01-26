import { useRef } from "react";
import useClickOutSideEffect from "@/hooks/useClickOutSideEffect";
import Button from "@/components/common/Button";
import Close from "@/components/icon/close.svg";
import { ModalProps } from ".";

type Props = ModalProps;

const Content = ({
  allowCloseOnOutside,
  children,
  className,
  isOpen,
  hideCloseButton,
  handleOpen,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useClickOutSideEffect(ref.current, () => {
    if (!allowCloseOnOutside) return;

    handleOpen(false);
  });

  return (
    <div
      ref={ref}
      role="dialog"
      className={`relative shadow-lg w-full h-full flex flex-col transition-all ${className}`}
      style={{
        opacity: isOpen ? 1 : 0,
      }}
    >
      {!hideCloseButton && (
        <Button
          role="button"
          className="absolute top-1 right-1 p-2 cursor-pointer"
          onClick={() => handleOpen(false)}
        >
          <Close className="[&>path]:fill-black" />
        </Button>
      )}
      {children}
    </div>
  );
};

export default Content;

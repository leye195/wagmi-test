import { ComponentProps } from "react";

const Button = ({
  children,
  className = "",
  ...props
}: ComponentProps<"button">) => {
  return (
    <button {...props} className={`${className}`}>
      {children}
    </button>
  );
};

export default Button;

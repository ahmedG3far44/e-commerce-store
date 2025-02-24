import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant: "primary" | "secondary";
  to?: string;
  type?: "button" | "reset" | "submit";
  funOnClick?: () => void | undefined;
}

function Button({ children, variant, to, type, funOnClick }: ButtonProps) {
  return (
    <button
      onClick={funOnClick}
      type={type ? type : "button"}
      className={`px-4 py-2 min-w-[100px] rounded-md border cursor-pointer duration-150 ${
        variant === "primary"
          ? "bg-blue-500 text-white hover:bg-white border-blue-500  hover:text-blue-500"
          : "border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
      }`}
    >
      {to ? <a href={to}>{children}</a> : children}
    </button>
  );
}

export default Button;

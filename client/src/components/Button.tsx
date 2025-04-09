import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className: string;
  variant: "primary" | "secondary";
  to?: string;
  type?: "button" | "reset" | "submit";
  funOnClick?: () => void | undefined;
}

function Button({ children, variant, to, type, className, funOnClick }: ButtonProps) {
  return (
    <button
      onClick={funOnClick}
      type={type ? type : "button"}
      className={`${className} px-3 py-1 rounded-md border cursor-pointer duration-150 ${
        variant === "primary"
          ? "bg-blue-500 text-white hover:bg-white border-blue-500  hover:text-blue-500"
          : "border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
      }`}
    >
      {to ? <a href={to} className="text-sm">{children}</a> : children}
    </button>
  );
}

export default Button;

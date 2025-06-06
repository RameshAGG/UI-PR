import React from "react";
import { Button as button } from "antd";

type ButtonProps = {
  label: string | React.ReactNode;
  onClick: (values: any) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button = ({ label, onClick, className, type = "button", children, disabled }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={` rounded-lg text-center ${className}`}
    >
      {children || label}      </button>
  );
};

export default Button;



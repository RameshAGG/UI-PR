import React from "react";

interface RequiredLabelProps {
  children: React.ReactNode;
  className?: string;
}

const RequiredLabel = ({ children, className }: RequiredLabelProps) => {
  return (
    <span className="after:ml-1 after:content-['*'] after:text-red-500 font-Montserrat text-[#000000] text-base font-Montserrat weight-500">
      {children}
    </span>
  );
};

export default RequiredLabel;
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Tooltip } from "antd";

interface CustomTooltipProps {
  title: string | string[];
  children: ReactNode;

}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ title, children }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  // Convert title to string (if array, join with a comma)
  const fullTitle = Array.isArray(title) ? title.join(", ") : title;

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowed(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [fullTitle]);

  return (
    <Tooltip title={isOverflowed ? fullTitle : undefined} placement="bottom">
      <div ref={textRef} className="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer w-[309px]">
        {children}
      </div>
    </Tooltip>
  );
};

export default CustomTooltip;

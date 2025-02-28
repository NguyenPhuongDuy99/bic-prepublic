import { cn } from "@/lib/utils";
import React from "react";

export interface TypograhphyProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const Typograhphy = ({ children, className, ...props }: TypograhphyProps) => {
  return (
    <h2 className={cn("text-[#2E3660] font-semibold leading-8 text-[20px]", className)} {...props}>
      {children}
    </h2>
  );
};

export default Typograhphy;

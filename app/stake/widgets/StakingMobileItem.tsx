'use client'
import { cn } from "@/lib/utils";
import { Button } from "@beincom/web-ui";
import React from "react";

export interface StakingMobileItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  isTimeOver?: boolean;
  onClick?: () => void
}
const StakingMobileItem = ({
  className,
  title,
  value,
  isTimeOver,
  onClick,
  ...props
}: StakingMobileItemProps) => {
  return (
    <div className={cn("flex justify-between", className)} {...props}>
      <p className="text-neutral-30 text-xs leading-5">{title}</p>
      {isTimeOver ? (
        <Button onClick={onClick}>Withdraw</Button>
      ) : (
        <p className="text-neutral-60 text-sm leading-5">{value}</p>
      )}
    </div>
  );
};

export default StakingMobileItem;

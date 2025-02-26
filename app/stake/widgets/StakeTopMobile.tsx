import Typograhphy from "@/components/Typograhphy";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";

interface StakeTopMobile extends React.HTMLAttributes<HTMLDivElement> {}

const StakeTopMobile = ({ className, ...props }: StakeTopMobile) => {
  const dataTable = [
    {
      tier: 1,
      stakingAmount: "1,000,000 BIC",
      interest: "90,000 BIC (40%)",
      timeLeft: "90 days, 6 hours, 35 min",
    },
    {
      tier: 2,
      stakingAmount: "1,000,000 BIC",
      interest: "90,000 BIC (40%)",
      timeLeft: "90 days, 6 hours, 35 min",
    },
    {
      tier: 3,
      stakingAmount: "1,000,000 BIC",
      interest: "90,000 BIC (40%)",
      timeLeft: "90 days, 6 hours, 35 min",
    },
    {
      tier: 4,
      stakingAmount: "1,000,000 BIC",
      interest: "90,000 BIC (40%)",
      timeLeft: "90 days, 6 hours, 35 min",
    },
    {
      tier: 5,
      stakingAmount: "1,000,000 BIC",
      interest: "90,000 BIC (40%)",
      timeLeft: "90 days, 6 hours, 35 min",
    },
  ];
  return (
    <Card className={cn("w-full rounded-xl", className)} {...props}>
      <CardContent className="p-6">
        <Typograhphy className="mb-5">My staking</Typograhphy>
        <div className="">
          <h3>Tier 1</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="text-neutral-30 text-xs leading-5">Staking amount</p>
              <p className="text-neutral-60 text-sm leading-5">1,000,000 BIC</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeTopMobile;

import StakingMobileItem from "@/app/stake/widgets/StakingMobileItem";
import Typograhphy from "@/components/Typograhphy";
import { Card, CardContent } from "@/components/ui/card";
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
      isTimeOver: true,
    },
  ];
  return (
    <Card className={cn("w-full rounded-xl", className)} {...props}>
      <CardContent className="p-6">
        <Typograhphy className="mb-5">My staking</Typograhphy>
        <div className="flex flex-col gap-4">
          {dataTable.map((item) => (
            <div key={item.tier} className="[&:not(:first-child)]:border-t-gray-5 [&:not(:first-child)]:border-t-[1px] [&:not(:first-child)]:pt-4">
              <h3 className="text-neutral-60 text-sm font-semibold">
                Tier {item.tier}
              </h3>
              <div className="flex flex-col gap-3">
                <StakingMobileItem
                  title="Staking Amount"
                  value={item.stakingAmount}
                />
                <StakingMobileItem
                  title="Interest (ARP)"
                  value={item.interest}
                />
                <StakingMobileItem
                  title="Time left"
                  value={item.timeLeft}
                  isTimeOver={item.isTimeOver}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeTopMobile;

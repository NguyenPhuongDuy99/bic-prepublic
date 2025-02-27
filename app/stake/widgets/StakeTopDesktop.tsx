"use client";
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
import { Button } from "@beincom/web-ui";
import React from "react";

interface StakeTopDesktop extends React.HTMLAttributes<HTMLDivElement> {}

const StakeTopDesktop = ({ className, ...props }: StakeTopDesktop) => {
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
      isTimeover: true,
    },
  ];
  return (
    <Card className={cn("w-full rounded-xl", className)} {...props}>
      <CardContent className="p-6">
        <Typograhphy className="mb-5">My staking</Typograhphy>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[58px]">Tier</TableHead>
              <TableHead className="w-[396px]">Staking amount</TableHead>
              <TableHead className="w-[396px]">Interest (ARP)</TableHead>
              <TableHead>Time left</TableHead>
            </TableRow>
          </TableHeader>
        </Table>

        <div
          className={cn({ "max-h-72 overflow-y-auto": dataTable.length > 10 })}
        >
          <Table>
            <TableBody>
              {dataTable.map((data, id) => (
                <TableRow key={id}>
                  <TableCell className="w-[58px] text-neutral-60 text-base font-normal leading-6">
                    {data.tier}
                  </TableCell>
                  <TableCell className=" w-[396px] text-neutral-60 text-base font-normal leading-6">
                    {data.stakingAmount}
                  </TableCell>
                  <TableCell className="w-[396px] text-neutral-60 text-base font-normal leading-6">
                    {data.interest}
                  </TableCell>
                  <TableCell className="text-neutral-60 text-base font-normal leading-6">
                    {data.isTimeover ? (
                      <Button onClick={() => console.log("click")}>
                        Withdraw
                      </Button>
                    ) : (
                      data.timeLeft
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeTopDesktop;

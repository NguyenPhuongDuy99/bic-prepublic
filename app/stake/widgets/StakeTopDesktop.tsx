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
import { useGetDeposits } from "@/app/stake/hooks/useGetDeposits";
import { useWithdrawStake } from "@/app/stake/hooks/useWithdrawStake";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface StakeTopDesktop extends React.HTMLAttributes<HTMLDivElement> {}

const StakeTopDesktop = ({ className, ...props }: StakeTopDesktop) => {
  const { isConnected } = useAccount();
  const { deposits, refetch } = useGetDeposits({
    enabled: isConnected,
  });
  const [withDrawIndex, setWithDrawIndex] = useState<number>(0);

  const { withdrawAsync, withdrawConfirmed, withdrawError } = useWithdrawStake({
    startIndex: withDrawIndex,
    batchSize: 1,
  });
  useEffect(() => {
    if (withdrawConfirmed) {
      toast.success("Withdrawn successfully!");
      refetch();
    }
  }, [withdrawConfirmed]);

  useEffect(() => {
    if (withdrawError) {
      toast.error("Withdraw failed");
    }
  }, [withdrawError]);
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
        {deposits.length > 0 ? (
          <div
            className={cn({ "max-h-72 overflow-y-auto": deposits.length > 10 })}
          >
            <Table>
              <TableBody>
                {deposits.map((data, id) => (
                  <TableRow key={id}>
                    <TableCell className="w-[58px] text-neutral-60 text-base font-normal leading-6">
                      {data.tier}
                    </TableCell>
                    <TableCell className=" w-[396px] text-neutral-60 text-base font-normal leading-6">
                      {data.stakingAmount} BIC
                    </TableCell>
                    <TableCell className="w-[396px] text-neutral-60 text-base font-normal leading-6">
                      {data.interest}
                    </TableCell>
                    <TableCell className="text-neutral-60 text-base font-normal leading-6">
                      {!data.withdrawn && data.timeLeft < 0 ? (
                        <Button
                          onClick={() => {
                            setWithDrawIndex(data.tier - 1);
                            setWithDrawIndex((prevState) => {
                              withdrawAsync();
                              return prevState;
                            });
                          }}
                        >
                          Withdraw
                        </Button>
                      ) : data.withdrawn ? (
                        "Withdrawn"
                      ) : (
                        data.timeLeft
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-10 flex justify-center items-center border border-primary rounded-lg text-sm">
            Stake list is empty
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakeTopDesktop;

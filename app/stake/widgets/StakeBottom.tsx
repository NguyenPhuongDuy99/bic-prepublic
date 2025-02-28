"use client";
import Typograhphy from "@/components/Typograhphy";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";
import { Button } from "@beincom/web-ui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/Field";
import { useGetCurrentTier } from "@/app/stake/hooks/useGetCurrentTier";
import {
  DEFAULT_CHAINID,
  EVM_CONTRACT,
} from "@/app/stake/constants/contractAddress";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useStake } from "@/app/stake/hooks/useStake";
import { toast } from "sonner";
import { useGetDeposits } from "../hooks/useGetDeposits";

const StakeBottom = () => {
  const { currentTier } = useGetCurrentTier({});
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();

  const { data: bicBalance } = useBalance({
    address,
    token: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.Bic,
    chainId: currentChainId,
  });
  const { refetch } = useGetDeposits();
  const listTitleData = {
    tier: "Current tier",
    interest: "Interest (ARP)",
    capacity: "Capacity",
  };

  const formSchema = z.object({
    amount: z.coerce.number({
      required_error: "Please fill in",
      invalid_type_error: "Amount must be a number",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = form;

  const { stakeAsync, stakeConfirmed, reset } = useStake({
    amount:
      getValues("amount") && isValid
        ? parseEther(getValues("amount").toString())
        : BigInt(0),
  });

  useEffect(() => {
    if (stakeConfirmed) {
      toast.success("Stake successfully");
      refetch()
      reset();
    }
  }, [stakeConfirmed]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      toast.warning("Please connect wallet", {
        position: "top-center",
      });
      return;
    }

    stakeAsync();
  };
  const onSetMaxValue = () => {
    if (bicBalance) {
      setValue("amount", Number(formatEther(bicBalance.value)));
    }
  };
  return (
    <Card className="w-full rounded-xl">
      <CardContent className="p-6">
        <Typograhphy className="mb-5">Stake BIC</Typograhphy>
        <div className="flex-col sm:flex-row flex">
          <div className="w-full sm:w-1/2">
            <div className="flex-col sm:flex-row flex gap-2 sm:gap-12">
              {Object.keys(currentTier).length > 0 ? (
                Object.keys(currentTier).map((item, id) => (
                  <div
                    className="flex sm:flex-col justify-between sm:justify-start gap-2"
                    key={id}
                  >
                    <h3 className="text-neutral-30 text-sm">
                      {listTitleData[item as keyof typeof listTitleData]}
                    </h3>
                    <p className="text-neutral-60 text-sm font-semibold">
                      {currentTier[item as keyof typeof currentTier]}
                    </p>
                  </div>
                ))
              ) : (
                <div>There is no current tier</div>
              )}
            </div>
          </div>
          <div className="flex-1 border border-transparent border-t-[#EAEDF2] sm:border-l-[#EAEDF2] sm:border-t-0 sm:pl-6 pt-3 sm:pt-0 mt-4 sm:mt-0">
            <Form {...form}>
              <form
                className="flex-col sm:flex-row flex items-end w-full gap-5 sm:gap-4"
                autoComplete="off"
              >
                <div className="flex relative w-full">
                  <InputField
                    name="amount"
                    control={control}
                    label="Amount"
                    id="amount"
                    placeholder="Enter amount"
                    className="flex-shrink-0"
                    balance={
                      bicBalance &&
                      `${formatEther(bicBalance?.value)} ${bicBalance.symbol}`
                    }
                  />
                  <Button
                    className="bg-gray-400 absolute right-1 bottom-1"
                    onClick={onSetMaxValue}
                  >
                    Max
                  </Button>
                </div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full sm:w-auto h-10"
                >
                  Stake
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeBottom;

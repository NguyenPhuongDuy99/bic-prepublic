"use client";
import { useAccount } from "wagmi";
import { useGetPrePublic } from "../hooks/useGetPrePublic";
import { useGetPrePublicRound } from "../hooks/useGetPrepublicRound";
import { useGetWhitelistCategory } from "../hooks/useGetWhitelistCategory";
import { ChartSection } from "./ChartSection";
import { PoolReverseSection } from "./PoolReverseSection";
import SwapSection from "./SwapSection";
import { Spinner } from "@beincom/web-ui";

export function Swap() {
  const { address, isConnecting } = useAccount();
  // get pre-public info
  const { prePublic, isLoading: isLoadingPrePublic } = useGetPrePublic({});

  const { whitelistCategory, isLoading: isLoadingWhitelistCategory } =
    useGetWhitelistCategory(
      {
        address: address,
      },
      {
        enabled: Boolean(address),
      },
    );
  // console.log('whitelist category', whitelistCategory)

  const { roundInfo, isLoading: isLoadingRoundInfo } = useGetPrePublicRound(
    {
      category: whitelistCategory,
    },
    {
      enabled: Boolean(whitelistCategory),
    },
  );

  if (
    isConnecting ||
    isLoadingWhitelistCategory ||
    isLoadingRoundInfo ||
    isLoadingPrePublic
  ) {
    return (
      <div className="flex-center h-screen w-full">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-4">
      <PoolReverseSection
        address={address}
        prePublic={prePublic}
        roundInfo={roundInfo}
      />
      {address && (
        <SwapSection
          address={address}
          prePublic={prePublic}
          roundInfo={roundInfo}
        />
      )}
      <ChartSection />
    </div>
  );
}

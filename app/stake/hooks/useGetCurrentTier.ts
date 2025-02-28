import { useAccount, useChainId, useReadContract } from "wagmi";
import { UseQueryOptions } from "@tanstack/react-query";
import { StakingPoolABI } from "@/app/stake/abis/StakingPool";
import {
  DEFAULT_CHAINID,
  EVM_CONTRACT,
} from "@/app/stake/constants/contractAddress";
import { formatEther } from "viem";
import { useGetTiers } from "@/app/stake/hooks/useGetTiers";

export function useGetCurrentTier(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const currentChainId = useChainId();
  const { isConnected } = useAccount();
  console.log('isConnected', isConnected)
  const {
    tiers,
    tiersQueryKey: queryKey,
    ...rest
  } = useGetTiers({
    enabled: isConnected,
  });

  let currentTierIndex = 0;
  const currentTier = (
    tiers as {
      totalStaked: bigint;
      maxTokens: bigint;
      annualInterestRate: bigint;
    }[]
  ).find((tier, index: number) => {
    currentTierIndex = index;
    return tier.totalStaked < tier.maxTokens;
  });

  if (!currentTier)
    return {
      currentTierQueryKey: queryKey,
      currentTier: {},
      ...rest,
    };

  const returnTier = {
    tier: currentTierIndex + 1,
    interest: Number(currentTier.annualInterestRate) / 100 + "%",
    capacity:
      formatEther(currentTier.totalStaked) +
      "/" +
      formatEther(currentTier.maxTokens),
  };
  return {
    currentTierQueryKey: queryKey,
    currentTier: returnTier,
    ...rest,
  };
}

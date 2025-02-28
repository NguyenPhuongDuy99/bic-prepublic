import { UseQueryOptions } from "@tanstack/react-query";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { StakingPoolABI } from "@/app/stake/abis/StakingPool";
import {
  DEFAULT_CHAINID,
  EVM_CONTRACT,
} from "@/app/stake/constants/contractAddress";
import { useGetTiers } from "@/app/stake/hooks/useGetTiers";
import { formatEther } from "viem";

export function useGetDeposits(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();

  const enabled = Boolean(queryOptions?.enabled);

  const { tiers, tiersQueryKey, ...restTiersQuery } = useGetTiers({
    enabled: isConnected,
  });

  const {
    data: deposits,
    queryKey,
    ...rest
  } = useReadContract({
    abi: StakingPoolABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.StakingPool,
    functionName: "getUserDeposits",
    chainId: currentChainId,
    args: [address],
    query: {
      enabled,
    },
  });

  if (!deposits)
    return {
      depositsQueryKey: queryKey,
      deposits: [],
      ...rest,
    };

  const depositReturn = (
    deposits as {
      amount: bigint;
      depositTime: bigint;
      tierIndex: bigint;
      withdrawn: boolean;
    }[]
  ).map((deposit) => {
    // @ts-ignore
    const currentTier = tiers[Number(deposit.tierIndex)];
    const interest = currentTier ? currentTier.annualInterestRate : 0;
    return {
      tier: Number(deposit.tierIndex) + 1,
      stakingAmount: formatEther(deposit.amount),
      interest: currentTier
        ? Number(currentTier.annualInterestRate) / 100 + "%"
        : "0%",
      timeLeft: Number(deposit.depositTime) - new Date().getTime() / 1000,
      withdrawn: deposit.withdrawn,
    };
  });

  return {
    depositsQueryKey: queryKey,
    deposits: depositReturn,
    ...rest,
  };
}

import { useChainId, useReadContract } from "wagmi";
import { UseQueryOptions } from "@tanstack/react-query";
import { StakingPoolABI } from "@/app/stake/abis/StakingPool";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "@/app/stake/constants/contractAddress";
import { formatEther } from 'viem'

export function useGetTiers(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  const {
    data: tiers,
    queryKey,
    ...rest
  } = useReadContract({
    abi: StakingPoolABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].StakingPool,
    functionName: "getTiers",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  return {
    tiersQueryKey: queryKey,
    tiers: tiers ? tiers : [],
    ...rest,
  };
}
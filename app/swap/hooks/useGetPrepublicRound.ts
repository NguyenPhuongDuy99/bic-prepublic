import { UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { BICABI } from "../abis/BIC";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";

interface RoundParams {
  category: bigint | undefined;
}

export interface RoundInfo {
  category: bigint;
  startTime: bigint;
  endTime: bigint;
  coolDown: bigint;
  maxAmountPerBuy: bigint;
}

export function useGetPrePublicRound(
  params: RoundParams,
  queryOptions?: Omit<
    UseQueryOptions<RoundInfo, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const currentChainId = useChainId();

  const enabled = Boolean(queryOptions?.enabled ?? true);

  const {
    data: roundInfo,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "prePublicRounds",
    chainId: currentChainId,
    args: [params.category!],
    query: {
      enabled,
    },
  });

  return {
    rundInfoQueryKey: queryKey,
    roundInfo: roundInfo
      ? ({
          category: roundInfo[0],
          startTime: roundInfo[1],
          endTime: roundInfo[2],
          coolDown: roundInfo[3],
          maxAmountPerBuy: roundInfo[4],
        } as RoundInfo)
      : undefined,
    ...rest,
  };
}

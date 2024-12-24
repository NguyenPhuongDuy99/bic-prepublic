import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { UniswapPairABI } from "../abis/uniswapPair";

export function useGetPairReserves(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: reserves,
    queryKey,
    ...rest
  } = useReadContract({
    abi: UniswapPairABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].Pair,
    functionName: "getReserves",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  const {
    data: token0,
  } = useReadContract({
    abi: UniswapPairABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].Pair,
    functionName: "token0",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  const {
    data: token1,
  } = useReadContract({
    abi: UniswapPairABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].Pair,
    functionName: "token1",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  return {
    reservesQueryKey: queryKey,
    reserves: reserves,
    tokens: [token0, token1],
    ...rest,
  };
}

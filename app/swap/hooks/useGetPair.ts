import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { BICABI } from "../abis/BIC";
import { UniswapRouterABI } from "../abis/uniswapRouter";

export function useGetPair(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: pair,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "uniswapV2Pair",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  const {
    data: WETH
  } = useReadContract({
    abi: UniswapRouterABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].UniswapRouter,
    functionName: "WETH",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });


  return {
    pairQueryKey: queryKey,
    pair: pair,
    ...rest,
  };
}

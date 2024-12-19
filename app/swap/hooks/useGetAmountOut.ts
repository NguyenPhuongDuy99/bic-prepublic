import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useBalance, useChainId, useClient, useReadContract } from "wagmi";
import { UniswapRouterABI } from "../abis/uniswapRouter";
import { EVM_CONTRACT } from "../constants/contractAddress";

interface BalanceParams {
  inAmount: bigint
  path: `0x${string}`[]
}

export function useGetOutAmount(
  params: BalanceParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    params.inAmount && params.path.length > 1 && (queryOptions?.enabled ?? true)
  )
  
  const {
    data: outAmounts,
    queryKey,
    ...rest
  } = useReadContract({
    abi: UniswapRouterABI,
    address: EVM_CONTRACT[currentChainId || '1301'].UniswapRouter,
    functionName: "getAmountsOut",
    chainId: currentChainId,
    args: [params.inAmount, params.path],
    query: {
      enabled
    }
  });

  return {
    outAmountQueryKey: queryKey,
    outAmounts: outAmounts,
    ...rest,
  };
}

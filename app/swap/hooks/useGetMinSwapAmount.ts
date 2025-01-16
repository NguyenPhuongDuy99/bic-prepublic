import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { BICABI } from "../abis/BIC";

export function useGetMinSwapAmount(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: minSwapBack,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "minSwapBackAmount",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  return {
    minSwapBackQueryKey: queryKey,
    minSwapBack: minSwapBack,
    ...rest,
  };
}

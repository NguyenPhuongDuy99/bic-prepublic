import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { BICABI } from "../abis/BIC";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";

interface RoundParams {
  address: `0x${string}` | undefined
}

export function useGetWhitelistCategory(
  params: RoundParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: whitelistCategory,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "getWhitelistCategory",
    chainId: currentChainId,
    args: [params.address!],
    query: {
      enabled
    }
  });

  return {
    whitelistCategoryQueryKey: queryKey,
    whitelistCategory: whitelistCategory,
    ...rest,
  };
}

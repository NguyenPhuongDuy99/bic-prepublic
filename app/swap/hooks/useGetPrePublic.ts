import { UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { BICABI } from "../abis/BIC";

export function useGetPrePublic(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const currentChainId = useChainId();

  const enabled = Boolean(queryOptions?.enabled ?? true);

  const {
    data: prePublic,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "prePublic",
    chainId: currentChainId,
    args: [],
    query: {
      enabled,
      refetchOnWindowFocus: false,
    },
  });

  return {
    prePublicQueryKey: queryKey,
    prePublic: prePublic,
    ...rest,
  };
}

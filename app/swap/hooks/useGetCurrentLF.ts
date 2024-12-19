import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { EVM_CONTRACT } from "../constants/contractAddress";
import { ERC20ABI } from "../abis/ERC20";

export function useGetCurrentLF(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: currentLF,
    queryKey,
    ...rest
  } = useReadContract({
    abi: ERC20ABI,
    address: EVM_CONTRACT[currentChainId || '1301'].BTest,
    functionName: "getCurrentLF",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  return {
    currentLFQueryKey: queryKey,
    currentLF: currentLF,
    ...rest,
  };
}

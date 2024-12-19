import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { EVM_CONTRACT } from "../constants/contractAddress";
import { BICABI } from "../abis/BIC";


export function useGetController(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: controller,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || '1301'].BTest,
    functionName: "treasuryController",
    chainId: currentChainId,
    args: [],
    query: {
      enabled
    }
  });

  return {
    controllerQueryKey: queryKey,
    controller: controller,
    ...rest,
  };
}

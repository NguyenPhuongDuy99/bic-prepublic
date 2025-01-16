import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { BICABI } from "../abis/BIC";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";

interface CoolDownParams {
  address: `0x${string}` | undefined
}

export function useGetCoolDown(
  params: CoolDownParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    params.address && (queryOptions?.enabled ?? true)
  )
  
  const {
    data: coolDown,
    queryKey,
    ...rest
  } = useReadContract({
    abi: BICABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    functionName: "coolDown",
    chainId: currentChainId,
    args: [params.address!],
    query: {
      enabled
    }
  });

  return {
    coolDownQueryKey: queryKey,
    coolDown: coolDown,
    ...rest,
  };
}

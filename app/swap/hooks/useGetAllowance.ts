import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { EVM_CONTRACT } from "../constants/contractAddress";
import { ERC20ABI } from "../abis/ERC20";

interface ApproveParams {
  owner: `0x${string}` | undefined
}

export function useGetAllowance(
  params: ApproveParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const currentChainId = useChainId()

  const enabled = Boolean(
    params.owner && (queryOptions?.enabled ?? true)
  )
  
  const {
    data: allowance,
    queryKey,
    ...rest
  } = useReadContract({
    abi: ERC20ABI,
    address: EVM_CONTRACT[currentChainId || '1301'].BTest,
    functionName: "allowance",
    chainId: currentChainId,
    args: [params.owner!, EVM_CONTRACT[currentChainId || '1301'].UniswapRouter],
    query: {
      enabled
    }
  });

  return {
    allowanceQueryKey: queryKey,
    allowance: allowance,
    ...rest,
  };
}

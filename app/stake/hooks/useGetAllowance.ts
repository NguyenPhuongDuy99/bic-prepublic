import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { ERC20ABI } from "@/app/swap/abis/ERC20";


export function useGetAllowance(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const { address } = useAccount();

  const currentChainId = useChainId()

  const enabled = Boolean(
    (queryOptions?.enabled ?? true)
  )
  
  const {
    data: allowance,
    queryKey,
    ...rest
  } = useReadContract({
    abi: ERC20ABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.Bic,
    functionName: "allowance",
    chainId: currentChainId,
    args: [address!, EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.StakingPool],
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

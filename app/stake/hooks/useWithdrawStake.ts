import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { StakingPoolABI } from "@/app/stake/abis/StakingPool";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "@/app/stake/constants/contractAddress";

interface WithdrawStakeParams {
  startIndex: number;
  batchSize: number;
}

export function useWithdrawStake(
  params: WithdrawStakeParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const addRecentTransaction = useAddRecentTransaction()
  const queryClient = useQueryClient();
  const { switchChainAsync } = useSwitchChain();
  const now = new Date().getTime()

  const withdrawConfig = {
    abi: StakingPoolABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].StakingPool,
    chainId: currentChainId,
    functionName: "withdrawBatch",
    args: [params.startIndex, params.batchSize],
    account: address,
  }

  const {
    writeContract,
    writeContractAsync,
    isPending: withdrawPending,
    isError: withdrawError,
    isSuccess: withdrawSuccess,
    isIdle: withdrawIdle,
    data: hash,
    ...rest
  } = useWriteContract();

  const {
    isLoading: withdrawConfirming,
    isSuccess: withdrawConfirmed,
    data: withdrawReceipt,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: Boolean(hash),
    },
  });

  if (withdrawReceipt) {
    addRecentTransaction({
      hash: withdrawReceipt.transactionHash,
      description: "withdraw"
    })
  }

  return {
    hash,
    withdraw: () => writeContract(withdrawConfig),
    withdrawAsync: async () => {
      await writeContractAsync(withdrawConfig)
    },
    withdrawPending,
    withdrawError,
    withdrawSuccess,
    withdrawIdle,
    withdrawConfirming,
    withdrawConfirmed,
    withdrawReceipt,
    ...rest,
  }
}
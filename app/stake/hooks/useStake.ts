import { useApprove } from "@/app/stake/hooks/useApprove";
import { DEFAULT_CHAIN, DEFAULT_CHAINID, EVM_CONTRACT } from "@/app/stake/constants/contractAddress";
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { StakingPoolABI } from "@/app/stake/abis/StakingPool";
import { getExplorerLink } from "@/lib/utils";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";

interface StakeParams {
  amount: bigint
}

export function useStake(
  params: StakeParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const addRecentTransaction = useAddRecentTransaction()
  const queryClient = useQueryClient();
  const { switchChainAsync } = useSwitchChain();
  const now = new Date().getTime()

  const {
    approveAsync,
    approvePending,
    approveSuccess
  } = useApprove({})

  const stakeConfig = {
    abi: StakingPoolABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].StakingPool,
    chainId: currentChainId,
    functionName: "deposit",
    args: [params.amount],
    account: address,
  }

  const {
    writeContract,
    writeContractAsync,
    isPending: stakePending,
    isError: stakeError,
    isSuccess: stakeSuccess,
    isIdle: stakeIdle,
    data: hash,
    ...rest
  } = useWriteContract();

  const {
    isLoading: stakeConfirming,
    isSuccess: stakeConfirmed,
    data: stakeReceipt,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: Boolean(hash),
    },
  });

  if (stakeReceipt) {
    addRecentTransaction({
      hash: stakeReceipt.transactionHash,
      description: "stake"
    })
  }

  const stakeTxLink =
    stakeReceipt &&
    getExplorerLink({
      chain: DEFAULT_CHAIN,
      type: "transaction",
      txHash: stakeReceipt.transactionHash,
    });


  async function checkChain() {
    if (currentChainId !== Number(DEFAULT_CHAINID)) {
      await switchChainAsync({ chainId: Number(DEFAULT_CHAINID) });
    }
  }

  return {
    hash,
    stake: () => writeContract(stakeConfig),
    stakeAsync: async () => {
      await checkChain();
      if (approvePending) {
        return
      }
      if (approveSuccess) {
        return writeContractAsync(stakeConfig);
      }
      if (params.amount > 0) {
        await approveAsync()
      }
    },
    stakeConfirmed,
    stakeConfirming,
    stakePending,
    ...rest,
  }
}
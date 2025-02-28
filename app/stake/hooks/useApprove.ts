import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getExplorerLink } from "@/lib/utils";
import { DEFAULT_CHAIN, DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { maxUint256, parseEther } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { ERC20ABI } from "@/app/swap/abis/ERC20";

export function useApprove(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction()
  const currentChainId = useChainId();
  const queryClient = useQueryClient();
  const { switchChainAsync } = useSwitchChain();

  const approveConfig = {
    abi: ERC20ABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.Bic,
    chainId: currentChainId,
    functionName: "approve",
    args: [EVM_CONTRACT[currentChainId || DEFAULT_CHAINID]?.StakingPool, maxUint256],
    account: address,
  } as const;


  const {
    writeContract,
    writeContractAsync,
    isPending: approvePending,
    isError: approveError,
    isSuccess: approveSuccess,
    isIdle: approveIdle,
    data: hash,
    ...rest
  } = useWriteContract();

  const {
    isLoading: approveConfirming,
    isSuccess: approveConfirmed,
    data: approveReceipt,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: Boolean(hash),
    },
  });

  if (approveReceipt) {
    addRecentTransaction({
      hash: approveReceipt.transactionHash,
      description: "approve"
    })
  }

  const approveTxLink =
    approveReceipt &&
    getExplorerLink({
      chain: DEFAULT_CHAIN,
      type: "transaction",
      txHash: approveReceipt.transactionHash,
    });

  async function checkChain() {
    if (currentChainId !== Number(DEFAULT_CHAINID)) {
      await switchChainAsync({ chainId: Number(DEFAULT_CHAINID) });
    }
  }

  return {
    hash,
    approve: () => writeContract(approveConfig),
    approveAsync: async () => {
      await checkChain();
      return writeContractAsync(approveConfig);
    },
    approveConfirmed,
    approveConfirming,
    approvePending,
    approveError,
    approveSuccess,
    approveIdle,
    approveTxLink,
    ...rest,
  };
}

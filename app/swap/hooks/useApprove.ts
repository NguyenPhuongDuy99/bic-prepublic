import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getExplorerLink } from "../../../lib/utils";
import { unichainSepolia } from "viem/chains";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { ERC20ABI } from "../abis/ERC20";
import { parseEther } from "viem";

export function useApprove(
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const queryClient = useQueryClient();
  const { switchChainAsync } = useSwitchChain();

  const approveConfig = {
    abi: ERC20ABI,
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    chainId: currentChainId,
    functionName: "approve",
    args: [EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].UniswapRouter, parseEther('9999999999999999999999999')],
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

  const approveTxLink =
    approveReceipt &&
    getExplorerLink({
      chain: unichainSepolia,
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

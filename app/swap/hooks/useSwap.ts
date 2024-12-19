import {
    useAccount,
    useChainId,
    useSwitchChain,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getExplorerLink } from "../../../lib/utils";
import { arbitrumSepolia, unichainSepolia } from "viem/chains";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { UniswapRouterABI } from "../abis/uniswapRouter";
import { TokenList } from "../constants/tokenList";
import { blobsToCommitments } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
  
  interface SwapParams {
    sell: boolean
    inAmount: bigint
  }
  
  export function useSwap(
    params: SwapParams,
    queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">
  ) {
    const { address } = useAccount();
    const currentChainId = useChainId();
    const addRecentTransaction = useAddRecentTransaction()
    const queryClient = useQueryClient();
    const { switchChainAsync } = useSwitchChain();
    const now = new Date().getTime()
    console.log('now', Math.floor(now / 1000))
  
    const buyConfig = {
      abi: UniswapRouterABI,
      address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].UniswapRouter,
      chainId: currentChainId,
      functionName: "swapExactETHForTokens",
      args: [BigInt(0), [TokenList[0].address, TokenList[1].address], address!, BigInt(Math.floor(now / 1000) + 600)],
      value: params.inAmount,
      account: address,
    } as const;

    const sellConfig = {
      abi: UniswapRouterABI,
      address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].UniswapRouter,
      chainId: currentChainId,
      functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
      args: [params.inAmount, BigInt(0), [TokenList[1].address, TokenList[0].address], address!, BigInt(Math.floor(now / 1000) + 600)],
      account: address,
    } as const;

    async function checkChain() {
      if (currentChainId !== Number(DEFAULT_CHAINID)) {
        await switchChainAsync({ chainId: Number(DEFAULT_CHAINID) });
      }
    }
  
    const {
      writeContract,
      writeContractAsync,
      isPending: swapPending,
      isError: swapError,
      isSuccess: swapSuccess,
      isIdle: swapIdle,
      data: hash,
      ...rest
    } = useWriteContract();
  
    const {
      isLoading: swapConfirming,
      isSuccess: swapConfirmed,
      data: swapReceipt,
    } = useWaitForTransactionReceipt({
      hash,
      query: {
        enabled: Boolean(hash),
      },
    });

    if (swapReceipt) {
      addRecentTransaction({
        hash: swapReceipt.transactionHash,
        description: "swap"
      })
    }
  
    const swapTxLink =
      swapReceipt &&
      getExplorerLink({
        chain: unichainSepolia,
        type: "transaction",
        txHash: swapReceipt.transactionHash,
      });
  
    return {
      hash,
      swap: () => params.sell ? writeContract(sellConfig) : writeContract(buyConfig),
      swapAsync: async () => {
        await checkChain();
        return params.sell ? writeContractAsync(sellConfig) : writeContractAsync(buyConfig);
      },
      swapConfirmed,
      swapConfirming,
      swapPending,
      swapError,
      swapSuccess,
      swapIdle,
      swapTxLink,
      ...rest,
    };
  }
  
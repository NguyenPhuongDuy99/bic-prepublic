"use client";

import { Divider } from "@/components/Divider";
import { TokenSelect } from "@/components/TokenSelect";
import { Button, Label } from "@/components/ui";
import { isNativeToken, TokenInfo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDebounceValue } from "usehooks-ts";
import { TokenInput } from "@/components/TokenInput";
import { ExternalLink } from "@/components/ExternalLink";
import { TokenList } from "../constants/tokenList";
import { useGetOutAmount } from "../hooks/useGetAmountOut";
import { useSwap } from "../hooks/useSwap";
import { useApprove } from "../hooks/useApprove";
import { useGetAllowance } from "../hooks/useGetAllowance";
import { useGetCurrentLF } from "../hooks/useGetCurrentLF";
import { THRESHOLD } from "../constants/config";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";

export function Swap() {
  const { address } = useAccount();
  const currentChainId = useChainId();

  // FROM TOKEN
  const [fromToken, setFromToken] = useState<TokenInfo | undefined>(
    TokenList?.[0],
  );

  const { data: fromTokenBalance } = useBalance({
    address,
    token: isNativeToken(fromToken, currentChainId)
      ? undefined
      : fromToken?.address,
    chainId: currentChainId,
  });

  const [toToken, setToToken] = useState<TokenInfo | undefined>(
    TokenList?.[1],
  );

  const { data: toTokenBalance } = useBalance({
    address,
    token: isNativeToken(toToken, currentChainId)
      ? undefined
      : toToken?.address,
    chainId: currentChainId,
  });

  const { currentLF } = useGetCurrentLF({})

  const { data: accumulatedLF } = useBalance({
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    token: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    chainId: currentChainId,
  })

  const inputBalance = fromTokenBalance
    ? parseFloat(
        formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
      ).toFixed(4)
    : undefined;

  const outputBalance = toTokenBalance
    ? parseFloat(
        formatUnits(toTokenBalance?.value, toTokenBalance?.decimals),
      ).toFixed(4)
    : undefined;

  const [inputAmount, setInputAmount] = useState<string>("");
  const [debouncedInputAmount] = useDebounceValue(inputAmount, 300);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const path = [fromToken?.address, toToken?.address]

  const { outAmounts } = useGetOutAmount({
    inAmount: parseUnits(debouncedInputAmount, fromToken ? fromToken.decimals : 18),
    path: path as `0x${string}`[]
  }, {
    enabled: Boolean(debouncedInputAmount) && Boolean(path.length) && Boolean(fromToken)
  })

  const { allowance } = useGetAllowance({ owner: address })

  function onMax() {
    if (!fromTokenBalance?.value) return;
    setInputAmount(
      formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
    );
  }

  const {
    approveAsync,
    approvePending,
    approveSuccess
  } = useApprove({})

  const {
    swapAsync,
    swapPending,
    swapSuccess,
    swapError,
    swapConfirmed,
    swapTxLink
  } = useSwap({
    sell: fromToken?.symbol === 'ETH' ? false : true,
    inAmount: parseUnits(debouncedInputAmount, fromToken ? fromToken.decimals : 18),
  })

  useEffect(() => {
    if (
      fromToken?.symbol != 'ETH' &&
      allowance && fromToken &&
      allowance < parseUnits('1000000', fromToken.decimals)) {
      setIsApproved(true);
    }
  }, [fromToken, allowance])

  useEffect(() => {
    if (approveSuccess) {
      setIsApproved(false)
    }
  }, [approveSuccess])

  return (
    <>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <Label className="flex-[8]">BTEST - WETH in Uniswap V2</Label>
      </div>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label>Context of BTest token's config </Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <Label className="flex-[5]">Max Allocation: 8.88B BTEST</Label>
            <Label className="flex-[5]">Min Swap Back and Liquify: 88.8M BTEST</Label>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <Label className="flex-[5]">Max LF: 15%</Label>
            <Label className="flex-[5]">Min LF: 3%</Label>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <Label className="flex-[5]">Current LF: {Number(currentLF) / 100}%</Label>
          </div>
        </div>
        <Divider className="my-4" />

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="origin-chain">From</Label>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <TokenSelect
                className="flex-[3]"
                tokens={TokenList}
                onTokenChange={(token) => setFromToken(token)}
                token={fromToken}
              />

              <TokenInput
                className="flex-[5]"
                balance={inputBalance}
                id="input-amount"
                placeholder="Enter amount"
                type="number"
                value={inputAmount}
                onMax={onMax}
                onChange={(e) => setInputAmount(e.currentTarget.value)}
              />
            </div>

            <Divider className="my-2" />

            <Label htmlFor="destination-chain">To</Label>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <TokenSelect
                className="flex-[3]"
                tokens={TokenList}
                onTokenChange={setToToken}
                token={toToken}
              />
              <TokenInput
                className="flex-[5]"
                balance={outputBalance}
                id="input-amount"
                placeholder="Output amount"
                type="number"
                defaultValue={formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)}
              />
            </div>
          </div>
        </div>
        <Divider className="my-4" />

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label style={{ color: 'orange' }}>Warning over max allocation and swap back and liquify</Label>
          { fromToken?.symbol === 'ETH' && outAmounts && toTokenBalance &&
            THRESHOLD.MaxAllocation < outAmounts[1] + toTokenBalance?.value && 
            <Label style={{ color: 'red' }}>Over Max Allocation</Label> }
          { fromToken?.symbol != 'ETH' && accumulatedLF &&
            THRESHOLD.MinSwapBackAndLiquify < accumulatedLF.value && 
            <Label style={{ color: 'red' }}>Swap back and liquify</Label> }
        </div>
        <Divider className="my-4" />

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label>Swap</Label>
          <Button
            onClick={() => isApproved ? approveAsync() : swapAsync()}
            disabled={!(outAmounts && toToken) || swapPending || approvePending}
            className="mt-2"
            variant="accent"
          >
            {isApproved ? 
              approvePending ? "Approving" :
                approveSuccess ? "Approve successful" :
                "Approve" :
                  swapPending
                    ? "Executing..."
                      : "Swap"}
          </Button>

          <div className="flex gap-2">
            {swapTxLink && (
              <ExternalLink icon href={swapTxLink}>
                Swap Tx
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

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
    swapAsync,
    swapPending,
    approvePending,
    approveSuccess,
    swapSuccess,
    swapError,
    swapConfirmed,
    swapTxLink
  } = useSwap({
    sell: fromToken?.symbol === 'ETH' ? false : true,
    inAmount: parseUnits(debouncedInputAmount, fromToken ? fromToken.decimals : 18),
    allowance: allowance ? allowance : BigInt(0)
  })

  return (
    <>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <Label className="flex-[8]">BTEST - ETH in Uniswap V2</Label>
      </div>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label>Context of BTest token's config </Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <Label className="flex-[5]">Max Allocation: 8.88B BTEST</Label>
            <Label className="flex-[5]">Min Swap Back and Liquify: 88.8M BTEST</Label>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <Label className="flex-[5]">Swap ETH - BTEST LF: 0%</Label>
            <Label className="flex-[5]">Swap BTEST - ETH LF: {Number(currentLF) / 100}%</Label>
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
                readOnly={true}
                defaultValue={Number(formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)).toFixed(4)}
              />
            </div>
          </div>
        </div>
        <Divider className="my-4" />

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label>Swap</Label>
          <Button
            onClick={() => swapAsync()}
            disabled={!(outAmounts && toToken) || swapPending || approvePending}
            className="mt-2"
            variant="accent"
          >
            {
              approvePending ? "Approving" :
                approveSuccess ? "Approve successful" :
                  swapPending
                    ? "Executing..."
                      : "Swap"
            }
          </Button>

          <div className="flex gap-2">
            {swapTxLink && (
              <ExternalLink icon href={swapTxLink}>
                Swap Tx
              </ExternalLink>
            )}
          </div>
        </div>
        <Divider className="my-4" />

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label style={{ color: 'orange' }}>Warning over max allocation and swap back and liquify</Label>
          <Divider className="my-4" />
          { fromToken?.symbol === 'ETH' && outAmounts && toTokenBalance &&
            THRESHOLD.MaxAllocation < outAmounts[1] + toTokenBalance?.value && 
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <Label className="flex-[5]">Your current allocation: {fromToken?.symbol === 'ETH' ? outputBalance : inputBalance} + Swap Output: {Number(formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)).toFixed(4)}</Label>
              <Label style={{ color: 'red' }}>Over Max Allocation 8.88B BTEST</Label>
            </div>
          }
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ExternalLink icon={true} href={`https://sepolia.uniscan.xyz/address/${EVM_CONTRACT[DEFAULT_CHAINID].BTest}`}><Label className="my-4">Accumulated LF: {Number(formatUnits(accumulatedLF ? accumulatedLF.value : BigInt(0), accumulatedLF ? accumulatedLF?.decimals: 18)).toFixed(4)} {accumulatedLF?.symbol}</Label></ExternalLink>
            
            { fromToken?.symbol != 'ETH' && accumulatedLF &&
              THRESHOLD.MinSwapBackAndLiquify < accumulatedLF.value && 
            <Label className="flex-[5]" style={{ color: 'red' }}>Over swap back and liquify threshold 88.8M BTEST</Label> }
          </div>
          <Divider className="my-4" />
          <ExternalLink icon={true} href={'https://sepolia.uniscan.xyz/token/0x74FEb96747D7dFd3F749589071bA72a1ab80b4E1'}>Accumulated Liquidity Position</ExternalLink>
        </div>
      </div>
    </>
  );
}

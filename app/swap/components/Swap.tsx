"use client";

import { Divider } from "@/components/Divider";
import { TokenSelect } from "@/components/TokenSelect";
import { Button, Label } from "@/components/ui";
import { formatTime, isNativeToken, TokenInfo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createPublicClient, encodePacked, formatUnits, fromHex, Hex, http, keccak256, parseUnits, toBytes, toHex } from "viem";
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
import { DEFAULT_CHAIN, DEFAULT_CHAINID, EVM_CONTRACT, STORAGE_LOCATION } from "../constants/contractAddress";
import { AddToken } from "./AddToken";
import { useGetPairReserves } from "../hooks/useGetPairReserves";
import { useGetWhitelistCategory } from "../hooks/useGetWhitelistCategory";
import { useGetPrePublicRound } from "../hooks/useGetPrepublicRound";
import { unichainSepolia } from "viem/chains";
import { useGetPrePublic } from "../hooks/useGetPrePublic";
import { useGetMinSwapAmount } from "../hooks/useGetMinSwapAmount";
import { useGetCoolDown } from "../hooks/useGetCoolDown";
import { useGetPair } from "../hooks/useGetPair";

export function Swap() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const now = Math.floor(new Date().getTime() / 1000)

  const client = createPublicClient({
    chain: DEFAULT_CHAIN,
    transport: http()
  })

  // min swap back and liquify
  const {
    minSwapBack
  } = useGetMinSwapAmount({})

  // get pre-public info
  const {
    prePublic
  } = useGetPrePublic({})

  const {
    whitelistCategory
  } = useGetWhitelistCategory({
    address: address
  }, {
    enabled: Boolean(address)
  })

  // console.log('whitelist category', whitelistCategory)

  const {
    roundInfo
  } = useGetPrePublicRound({
    category: BigInt(1)
  }, {
    enabled: Boolean(whitelistCategory)
  })

  console.log('round info', roundInfo)

  // get cool down
  const {
    coolDown
  } = useGetCoolDown({
    address: address
  })

  console.log('cool down', coolDown)

  // get pair reserves

  const {
    pair
  } = useGetPair({})

  console.log('pair', pair)

  const {
    reserves,
    tokens
  } = useGetPairReserves({})

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

  console.log('amount out', outAmounts)

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
        <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
          
          <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <Label className="flex-[5] text-md">Pool Reserves:</Label>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <Label className="flex-[5] text-lg">
                {`${Number(formatUnits(reserves ? reserves[0] : BigInt(0), 18)).toFixed(4)} ${Number(tokens[0]) > Number(tokens[1]) ? "B139" : "ETH"} - 
                  ${Number(formatUnits(reserves ? reserves[1] : BigInt(0), 18)).toFixed(4)} ${Number(tokens[1]) > Number(tokens[0]) ? "B139" : "ETH"}
                `}
              </Label>
              <AddToken />
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <ExternalLink className="flex-5" icon={true} href={`https://sepolia.uniscan.xyz/token/${EVM_CONTRACT[DEFAULT_CHAINID].Pair}`}>
                <Label>B139 - ETH in Uniswap V2</Label>
              </ExternalLink>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center my-4 gap-2">
              <Label className="flex-[5]">Min Swap Back and Liquify</Label>
              <Label className="flex-[5]">Swap ETH - B139 LF</Label>
              <Label className="flex-[5]">Swap B139 - ETH LF</Label>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2 text-bold">
              <Label className="flex-[5]">{formatUnits(minSwapBack ?? BigInt(0), 24)}M B139</Label>
              <Label className="flex-[5]">0%</Label>
              <Label className="flex-[5]">{Number(currentLF) / 100}%</Label>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label className="w-full text-lg" style={{ color: 'orange' }}>{prePublic ? "Pre Public Phase" : "Public Phase"}</Label>
          {prePublic ? roundInfo ? (<>
            <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
              <Label>Your Pre-Public Round {roundInfo.category}</Label>
              <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
                <Label className="flex-[5]">Start At: {formatTime(Number(roundInfo.startTime) * 1000)} (UTC +7)</Label>
                <Label className="flex-[5]">End At: {formatTime(Number(roundInfo.endTime) * 1000)} (UTC +7)</Label>
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
                <Label className="flex-[5]">Cool down: {roundInfo.coolDown} seconds</Label>
                <Label className="flex-[5]">Max Amount Per Buy: {(Number(formatUnits(roundInfo.maxAmountPerBuy, 18)) / 1000000).toFixed(2)}M B139</Label>
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
                { coolDown && coolDown > BigInt(0) && <Label className="flex-[5]">Your last buy: {formatTime(Number(coolDown))} (UTC +7)</Label>}
              </div>
            </div>
            <Divider className="my-4" />
          </>) : (
            <Label className="w-full text-md" style={{ color: "red" }}>You are not in whitelist. Please wait for public phase!</Label>
          ) : (<></>)
          }
          <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
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
                  defaultValue={
                    Number(formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)).toFixed(8)
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
                <div className="flex flex-col items-start gap-2 w-full">
                  { roundInfo && prePublic && (now < roundInfo.startTime || now > roundInfo.endTime) && 
                    <Label className="flex-[5]" style={{ color: 'red' }}>Your pre-public round is not active. Please check the round info above!</Label>
                  }
                  { roundInfo && prePublic && 
                        outAmounts && fromToken && fromToken.symbol === 'ETH' && outAmounts[1] > roundInfo.maxAmountPerBuy && <div>
                      <Label className="flex-[5]" style={{ color: 'red' }}>Over swap max amount per buy in your pre-public round {formatUnits(roundInfo.maxAmountPerBuy, 18)} BTEST</Label>
                    </div> 
                  }
                  {
                    prePublic && (!roundInfo) && <Label className="w-full" style={{ color: "red" }}>You are not in whitelist. Please wait for public phase!</Label>
                  }
                  
                  <Button
                    onClick={() => swapAsync()}
                    disabled={!(outAmounts && toToken) || swapPending || approvePending || (prePublic && roundInfo && (now < roundInfo.startTime || now > roundInfo.endTime))}
                    className="w-full"
                    variant="accent"
                  >
                    {
                      approvePending ? "Approving" :
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
              </div>
            </div>
          </div>
        </div>
        <Divider className="my-4" />

        {/* <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          { roundInfo && prePublic && (now < roundInfo.startTime || now > roundInfo.endTime) && 
            <Label className="flex-[5]" style={{ color: 'red' }}>Your pre-public round is not active. Please check the round info above!</Label>
          }
          { roundInfo && prePublic && 
                outAmounts && fromToken && fromToken.symbol === 'ETH' && outAmounts[1] > roundInfo.maxAmountPerBuy && <div>
              <Label className="flex-[5]" style={{ color: 'red' }}>Over swap max amount per buy in your pre-public round {formatUnits(roundInfo.maxAmountPerBuy, 18)} BTEST</Label>
            </div> 
          }
          {
            prePublic && (!roundInfo) && <Label className="w-full" style={{ color: "red" }}>You are not in whitelist. Please wait for public phase!</Label>
          }
          
          <Label>Swap</Label>
          <Button
            onClick={() => swapAsync()}
            disabled={!(outAmounts && toToken) || swapPending || approvePending}
            className="mt-2"
            variant="accent"
          >
            {
              approvePending ? "Approving" :
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
        <Divider className="my-4" /> */}

        <div className="flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
          <Label style={{ color: 'orange' }}>Warning over swap back and liquify</Label>
          <Divider className="my-4" />
          {/* { fromToken?.symbol === 'ETH' && outAmounts && toTokenBalance &&
            THRESHOLD.MaxAllocation < outAmounts[1] + toTokenBalance?.value && 
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <Label className="flex-[5]">Your current allocation: {fromToken?.symbol === 'ETH' ? outputBalance : inputBalance} + Swap Output: {Number(formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)).toFixed(4)}</Label>
              <Label style={{ color: 'red' }}>Over Max Allocation 8.88B BTEST</Label>
            </div>
          } */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ExternalLink icon={true} href={`https://arbiscan.io/address/${EVM_CONTRACT[DEFAULT_CHAINID].BTest}`}><Label className="my-4">Accumulated LF: {Number(formatUnits(accumulatedLF ? accumulatedLF.value : BigInt(0), accumulatedLF ? accumulatedLF?.decimals: 18)).toFixed(4)} {accumulatedLF?.symbol}</Label></ExternalLink>
            
            { fromToken?.symbol != 'ETH' && accumulatedLF &&
              THRESHOLD.MinSwapBackAndLiquify < accumulatedLF.value && 
            <Label className="flex-[5]" style={{ color: 'red' }}>Over swap back and liquify threshold 88.8M BTEST</Label> }
          </div>
          <Divider className="my-4" />
          <ExternalLink icon={true} href={`https://arbiscan.io/token/${EVM_CONTRACT[DEFAULT_CHAINID].Pair}`}>Accumulated Liquidity Position</ExternalLink>
        </div>
      </div>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]" style={{ height: '1000px'}}>
        <iframe height="100%" width="100%" id="geckoterminal-embed" title="GeckoTerminal Embed" src={`https://www.geckoterminal.com/${DEFAULT_CHAINID == '1301' ? `unichain-sepolia` : `arbitrum`}/pools/${EVM_CONTRACT[DEFAULT_CHAINID].Pair}?embed=1&info=0&swaps=1&grayscale=1&light_chart=0`} frameBorder="0" allow="clipboard-write" allowFullScreen></iframe>
      </div>
    </>
  );
}

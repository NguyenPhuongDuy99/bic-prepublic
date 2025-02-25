import { Label } from "@/components/ui";
import { isNativeToken, TokenInfo } from "@/lib/utils";
import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { ExternalLinkButton } from "@/components/ExternalLink";
import { TokenList } from "../constants/tokenList";
import { THRESHOLD } from "../constants/config";
import {
  DEFAULT_CHAIN,
  DEFAULT_CHAINID,
  EVM_CONTRACT,
} from "../constants/contractAddress";
import { EXPLORER } from "../constants/explorer";
import { useState } from "react";
import { useGetOutAmount } from "../hooks/useGetAmountOut";
import { useDebounceValue } from "usehooks-ts";
import { useSwap } from "../hooks/useSwap";
import { useGetAllowance } from "../hooks/useGetAllowance";
import { useBalance, useChainId } from "wagmi";
import { useGetPair } from "../hooks/useGetPair";
import { RoundInfo } from "../hooks/useGetPrepublicRound";
import SectionLayout from "../components/SectionLayout";
import { TokenSwapIcon } from "@beincom/web-icons";
import { Button, Input } from "@beincom/web-ui";
import { TokenSelectBox } from "../components/TokenSelectBox";
import { NumericFormat } from "react-number-format";
import { formatNumber } from "../hooks/formatNumberByDecimal";
interface Props {
  address?: `0x${string}`;
  prePublic?: boolean;
  roundInfo?: RoundInfo;
}

const EIGHT_DECIMALS = 8;
const SIX_DECIMALS = 6;
export default function SwapSection({ address, prePublic, roundInfo }: Props) {
  const client = createPublicClient({
    chain: DEFAULT_CHAIN,
    transport: http(),
  });

  // console.log('round info', roundInfo)
  // console.log('cool down', coolDown)
  // get pair reserves
  const { pair } = useGetPair({});

  // console.log('amount out', outAmounts)
  const currentChainId = useChainId();
  const now = Math.floor(new Date().getTime() / 1000);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [debouncedInputAmount] = useDebounceValue(inputAmount, 300);

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

  const [toToken, setToToken] = useState<TokenInfo | undefined>(TokenList?.[1]);

  const { data: toTokenBalance } = useBalance({
    address,
    token: isNativeToken(toToken, currentChainId)
      ? undefined
      : toToken?.address,
    chainId: currentChainId,
  });

  const { data: accumulatedLF } = useBalance({
    address: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    token: EVM_CONTRACT[currentChainId || DEFAULT_CHAINID].BTest,
    chainId: currentChainId,
  });

  const inputBalance = fromTokenBalance
    ? formatNumber(
        formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
        SIX_DECIMALS,
      )
    : undefined;

  const outputBalance = toTokenBalance
    ? formatNumber(
        formatUnits(toTokenBalance?.value, toTokenBalance?.decimals),
        2,
      )
    : undefined;

  const path = [fromToken?.address, toToken?.address];

  const { outAmounts } = useGetOutAmount(
    {
      inAmount: parseUnits(
        debouncedInputAmount,
        fromToken ? fromToken.decimals : 18,
      ),
      path: path as `0x${string}`[],
    },
    {
      enabled:
        Boolean(debouncedInputAmount) &&
        Boolean(path.length) &&
        Boolean(fromToken),
    },
  );

  const { allowance } = useGetAllowance({ owner: address });

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
    swapTxLink,
  } = useSwap({
    sell: fromToken?.symbol === "ETH" ? false : true,
    inAmount: parseUnits(
      debouncedInputAmount,
      fromToken ? fromToken.decimals : 18,
    ),
    allowance: allowance ? allowance : BigInt(0),
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <SectionLayout className="flex flex-col items-start gap-6 w-full">
        {/* <Label className="w-full text-lg" style={{ color: "orange" }}>
          {prePublic ? "Pre Public Phase" : "Public Phase"}
        </Label> */}
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="w-full flex flex-col gap-2">
            <Label
              htmlFor="origin-chain"
              className="text-base font-normal text-neutral-60"
            >
              Sell
            </Label>
            <div className="w-full flex justify-start items-center gap-3">
              <TokenSelectBox
                token={fromToken}
                options={TokenList}
                onTokenChange={setFromToken}
              />
              <Input
                focused={undefined}
                filled={undefined}
                className="flex w-full"
                // suffix={
                //   <Button
                //     type="ghost"
                //     variant="neutral"
                //     size="sm"
                //     onClick={onMax}
                //     className="px-2"
                //   >
                //     Max
                //   </Button>
                // }
              >
                {/* rong co max nho ko co */}
                <NumericFormat
                  id="input-amount"
                  value={inputAmount}
                  allowLeadingZeros={false}
                  thousandSeparator=","
                  decimalScale={10}
                  placeholder="Enter amount"
                  allowNegative={false}
                  className="flex-1 text-ellipsis text-left text-sm font-medium text-neutral-60 disabled:text-neutral-20 focus:outline-none"
                  onValueChange={(value) => setInputAmount(value.value)}
                />

                <Label className="text-xs text-neutral-40">
                  {inputBalance}
                </Label>
              </Input>
            </div>
          </div>

          <Button
            isOnlyIcon={true}
            variant="neutral"
            size="md"
            type="subtle"
            className="rounded-full border border-neutral-5 p-2 h-8 w-8"
            onClick={() => {
              setFromToken(toToken);
              setToToken(fromToken);
              setInputAmount("");
            }}
          >
            <TokenSwapIcon className="size-5 text-neutral-60 shrink-0" />
          </Button>
          <div className="w-full flex flex-col gap-2">
            <Label
              htmlFor="destination-chain"
              className="text-base font-normal text-neutral-60"
            >
              Buy
            </Label>
            <div className="w-full flex justify-start items-center gap-3">
              <TokenSelectBox
                token={toToken}
                options={TokenList}
                onTokenChange={setToToken}
              />
              <Input focused={undefined} filled={undefined}>
                <NumericFormat
                  displayType="text"
                  value={Number(
                    formatUnits(
                      outAmounts ? outAmounts[1] : BigInt(0),
                      toToken ? toToken.decimals : 18,
                    ),
                  ).toFixed(2)}
                  id="input-amount"
                  allowLeadingZeros={false}
                  thousandSeparator=","
                  decimalScale={EIGHT_DECIMALS}
                  placeholder="Output amount"
                  allowNegative={false}
                  className="max-w-[100px] text-left text-sm font-medium text-neutral-60 disabled:text-neutral-20 overflow-hidden"
                />

                <Label className="text-xs text-neutral-40">
                  {outputBalance}
                </Label>
              </Input>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
          <div className="flex flex-col items-start gap-2 w-full">
            {roundInfo &&
              prePublic &&
              (now < roundInfo.startTime || now > roundInfo.endTime) && (
                <Label className="flex-[5]" style={{ color: "red" }}>
                  Your pre-public round is not active. Please check the round
                  info above!
                </Label>
              )}
            {roundInfo &&
              prePublic &&
              outAmounts &&
              fromToken &&
              fromToken.symbol === "ETH" &&
              outAmounts[1] > roundInfo.maxAmountPerBuy && (
                <div>
                  <Label className="flex-[5]" style={{ color: "red" }}>
                    Over swap max amount per buy in your pre-public round{" "}
                    {formatUnits(roundInfo.maxAmountPerBuy, 18)} BTEST
                  </Label>
                </div>
              )}
            {prePublic && !roundInfo && (
              <Label className="w-full" style={{ color: "red" }}>
                You are not in whitelist. Please wait for public phase!
              </Label>
            )}

            <Button
              onClick={() => swapAsync()}
              disabled={
                !(outAmounts && toToken) ||
                swapPending ||
                approvePending ||
                (prePublic &&
                  roundInfo &&
                  (now < roundInfo.startTime || now > roundInfo.endTime))
              }
              className="w-full"
              variant="primary"
              size="xl"
            >
              {approvePending
                ? "Approving"
                : swapPending
                ? "Executing..."
                : "Swap"}
            </Button>

            {/* <div className="flex gap-2">
                    {swapTxLink && (
                      <ExternalLink icon href={swapTxLink}>
                        Swap Tx
                      </ExternalLink>
                    )}
                  </div> */}
          </div>
        </div>
      </SectionLayout>

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

      <SectionLayout className="flex flex-col items-start gap-6 ">
        <Label style={{ color: "#ED9B07" }} className="text-base font-normal">
          Warning over swap back and liquify
        </Label>
        {/* { fromToken?.symbol === 'ETH' && outAmounts && toTokenBalance &&
            THRESHOLD.MaxAllocation < outAmounts[1] + toTokenBalance?.value && 
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
              <Label className="flex-[5]">Your current allocation: {fromToken?.symbol === 'ETH' ? outputBalance : inputBalance} + Swap Output: {Number(formatUnits(outAmounts ? outAmounts[1] : BigInt(0), toToken ? toToken.decimals : 18)).toFixed(4)}</Label>
              <Label style={{ color: 'red' }}>Over Max Allocation 8.88B BTEST</Label>
            </div>
          } */}
        <div className="w-full flex flex-col gap-3 md:flex-row md:justify-start">
          <div className="w-full flex flex-col justify-start items-center gap-2 md:w-auto">
            <ExternalLinkButton
              icon={true}
              href={`${EXPLORER[DEFAULT_CHAINID]}/address/${EVM_CONTRACT[DEFAULT_CHAINID].BTest}`}
              className="md:w-fit"
            >
              <Label className="my-4">
                Accumulated LF:{" "}
                {Number(
                  formatUnits(
                    accumulatedLF ? accumulatedLF.value : BigInt(0),
                    accumulatedLF ? accumulatedLF?.decimals : 18,
                  ),
                ).toFixed(4)}{" "}
                {accumulatedLF?.symbol}
              </Label>
            </ExternalLinkButton>

            {fromToken?.symbol != "ETH" &&
              accumulatedLF &&
              THRESHOLD.MinSwapBackAndLiquify < accumulatedLF.value && (
                <Label className="flex-[5]" style={{ color: "red" }}>
                  Over swap back and liquify threshold 88.8M BTEST
                </Label>
              )}
          </div>
          <ExternalLinkButton
            icon={true}
            href={`${EXPLORER[DEFAULT_CHAINID]}/token/${EVM_CONTRACT[DEFAULT_CHAINID].Pair}`}
            className="md:w-fit"
          >
            Accumulated Liquidity Position
          </ExternalLinkButton>
        </div>
      </SectionLayout>
    </div>
  );
}

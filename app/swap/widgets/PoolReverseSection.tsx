"use client";

import { Label } from "@/components/ui";
import { formatUnits } from "viem";
import { useGetPairReserves } from "../hooks/useGetPairReserves";
import { useGetCurrentLF } from "../hooks/useGetCurrentLF";
import { useGetMinSwapAmount } from "../hooks/useGetMinSwapAmount";
import { AddToken } from "../components/AddToken";
import { ExternalLinkButton } from "@/components/ExternalLink";
import { EXPLORER } from "../constants/explorer";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { numericFormatter } from "react-number-format";
import { AutoTextSize } from "auto-text-size";
import { Divider, HelpText, Skeleton } from "@beincom/web-ui";
import CustomCountdown from "../components/CountDown";
import { useGetCoolDown } from "../hooks/useGetCoolDown";
import { FireIcon } from "@beincom/web-icons";
import { RoundInfo } from "../hooks/useGetPrepublicRound";
import SectionLayout from "../components/SectionLayout";
import CoolDown from "../components/CoolDown";
import { isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { BIC_SYMBOL } from "../constants/tokenList";

type PoolReverseSectionProps = {
  address?: `0x${string}`;
  prePublic?: boolean;
  roundInfo?: RoundInfo;
};

const formatNumber = (value: string) => {
  return numericFormatter(value, {
    thousandSeparator: true,
    decimalScale: 4,
  });
};

const Item = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-normal text-neutral-30">{label}</div>
      {isLoading ? (
        <Skeleton className="w-6 h-6" />
      ) : (
        <div className="text-sm font-medium text-neutral-60">{value}</div>
      )}
    </div>
  );
};
export const PoolReverseSection = ({
  address,
  prePublic,
  roundInfo,
}: PoolReverseSectionProps) => {
  // min swap back and liquify
  const { minSwapBack, isLoading: isLoadingMinSwapBack } = useGetMinSwapAmount(
    {},
  );
  // console.log('pair', pair)
  const {
    reserves,
    tokens,
    isLoading: isLoadingPairReserves,
  } = useGetPairReserves({});

  const { currentLF, isLoading: isLoadingCurrentLF } = useGetCurrentLF({});

  // get cool down
  const { coolDown } = useGetCoolDown(
    {
      address: address,
    },
    {
      enabled: Boolean(address),
    },
  );

  const isStartSales = Number(roundInfo?.startTime) * 1000 < Date.now();

  const renderPrePublicPhase = () => {
    if (!roundInfo || !address) return;
    if (!prePublic) {
      return (
        <HelpText
          state="error"
          containerClassName="[&_svg]:text-red-50"
          className="text-red-50"
        >
          You are not in whitelist. Please wait for public phase!
        </HelpText>
      );
    }

    const maxAmountPerBuy = numericFormatter(
      formatUnits(roundInfo.maxAmountPerBuy ?? BigInt(0), 18),
      {
        thousandSeparator: true,
      },
    );
    const coolDownDate = new Date(Number(coolDown) * 1000);

    return (
      <>
        <Divider orientation="horizontal" className="md:hidden" />
        <Divider orientation="vertical" className="hidden md:block" />
        <Item label="Whitelist" value={`${roundInfo.category}`} />
        <Item label="Max Per Buy" value={`${maxAmountPerBuy} ${BIC_SYMBOL}`} />
        {isPast(coolDownDate) && (
          <div className="flex flex-col gap-2 md:justify-between">
            <div className="text-sm font-normal text-neutral-30">Cooldown</div>
            <CoolDown date={coolDownDate} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {isStartSales ? (
            <div className="text-lg font-semibold text-neutral-60 flex items-center gap-2">
              <FireIcon className="w-6 h-6" />
              Sales end in
            </div>
          ) : (
            <div className="text-sm font-normal text-neutral-30">
              Open sales in
            </div>
          )}
          <CustomCountdown
            date={
              new Date(
                isStartSales
                  ? Number(roundInfo.endTime) * 1000
                  : Number(roundInfo.startTime) * 1000,
              )
            }
          />
        </div>
      </>
    );
  };

  const PoolReservesInfo = ({ className }: { className?: string }) => {
    return (
      <div
        className={cn(
          "w-full flex flex-col justify-start items-center gap-2",
          className,
        )}
      >
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2">
          {isLoadingPairReserves ? (
            <Skeleton className="w-full h-6" />
          ) : (
            <AutoTextSize
              className="text-base font-semibold text-neutral-60 text-center w-full"
              maxFontSizePx={16}
            >
              {`${formatNumber(
                formatUnits(reserves ? reserves[0] : BigInt(0), 18),
              )} ${
                Number(tokens[0]) > Number(tokens[1]) ? BIC_SYMBOL : "ETH"
              } - 
            ${formatNumber(
              formatUnits(reserves ? reserves[1] : BigInt(0), 18),
            )} ${Number(tokens[1]) > Number(tokens[0]) ? BIC_SYMBOL : "ETH"}
          `}
            </AutoTextSize>
          )}
        </div>
        <ExternalLinkButton
          icon={true}
          buttonProps={{ className: "w-full md:w-2/3" }}
          href={`${EXPLORER[DEFAULT_CHAINID]}/token/${EVM_CONTRACT[DEFAULT_CHAINID].Pair}`}
        >
          {BIC_SYMBOL} - ETH Uniswap V2
        </ExternalLinkButton>
      </div>
    );
  };

  const minSwapBackValue = formatUnits(minSwapBack ?? BigInt(0), 18);

  return (
    <SectionLayout className="flex flex-col gap-8">
      <div className="w-full flex flex-col justify-start items-center gap-6">
        <div className="w-full flex justify-between items-center md:items-start">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-normal text-neutral-30">
              Pool Reserves:
            </Label>
            <PoolReservesInfo className="hidden md:flex" />
          </div>
          <AddToken />
        </div>
        <PoolReservesInfo className="md:hidden" />
      </div>
      <div className="flex flex-col gap-3 md:gap-2 md:flex-row lg:gap-10">
        <Item
          label="Min Swap Back and Liquify"
          value={`${formatNumber(minSwapBackValue)} ${BIC_SYMBOL}`}
          isLoading={isLoadingMinSwapBack}
        />
        <Item label={`Swap ETH - ${BIC_SYMBOL} LF`} value={"0%"} />
        <Item
          label={`Swap ${BIC_SYMBOL} - ETH LF`}
          value={`${Number(currentLF) / 100}%`}
          isLoading={isLoadingCurrentLF}
        />

        {renderPrePublicPhase()}
      </div>
    </SectionLayout>
  );
};

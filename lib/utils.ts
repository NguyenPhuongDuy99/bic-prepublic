import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address, Chain, Hash } from "viem";
import { SUPPORTED_CHAINS } from "./chains";

export type TokenInfo = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logo: React.ReactNode;
};

type ExplorerLinkParams = {
  chain: Chain;
} & (
  | {
      type: "address";
      address: Address;
    }
  | {
      type: "transaction";
      txHash: Hash;
    }
  | {
      type: "event";
      txHash: Hash;
      eventIndex: number;
    }
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNativeToken(
  token: TokenInfo | undefined,
  chainId: number | undefined,
) {
  if (!token || !chainId) return;
  const chainNativeCurrency = SUPPORTED_CHAINS.find(
    (chain) => chain.id === chainId,
  )?.nativeCurrency;
  if (!chainNativeCurrency) {
    throw new Error("Chain not supported");
  }
  return Boolean(
    chainNativeCurrency.symbol === token.symbol &&
      chainNativeCurrency.decimals === token.decimals,
  );
}

export function getExplorerLink(params: ExplorerLinkParams) {
  const url = params.chain.blockExplorers?.default.url;
  if (!url) {
    return;
  }

  if (params.type === "address") {
    return `${url}/address/${params.address}`;
  }

  if (params.type === "transaction") {
    return `${url}/tx/${params.txHash}`;
  }

  if (params.type === "event") {
    return `${url}/tx/${params.txHash}#eventlog#${params.eventIndex}`;
  }
}

export const TimeFormat: Intl.DateTimeFormatOptions = {
  month: "short", // 'Aug'
  day: "2-digit", // '26'
  year: "numeric", // '2024'
  hour: "2-digit", // '01'
  minute: "2-digit", // '11'
  hour12: true, // 'PM'
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("us-US", TimeFormat);
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address, Chain, Hash } from "viem";
import { SUPPORTED_CHAINS } from "./chains";

export type TokenInfo = {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    logoUrl: string;
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
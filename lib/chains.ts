import { Chain } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  linea,
  lisk,
  scroll,
  redstone,
  zora,
  blast,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
  polygonAmoy,
  blastSepolia,
  modeTestnet,
} from "wagmi/chains";

const unichainSepolia = {
  id: 1301,
  name: 'Unichain Sepolia',
  iconUrl: 'https://app.uniswap.org/static/media/unichain-sepolia-logo.e3813b94f5a1e0bd70ae.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.unichain.org'] },
  },
  blockExplorers: {
    default: { name: 'Uniscan', url: 'https://sepolia.uniscan.xyz' },
  },
} as const satisfies Chain;

export const MAINNET_SUPPORTED_CHAINS = [
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  linea,
  lisk,
  scroll,
  redstone,
  zora,
  blast,
] as const;

export const TESTNET_SUPPORTED_CHAINS = [
  unichainSepolia
] as const;

export const SUPPORTED_CHAINS = TESTNET_SUPPORTED_CHAINS;
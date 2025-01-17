import { TokenInfo } from "@/lib/utils";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "./contractAddress";

export const TokenList: TokenInfo[] = [
    {
        address: '0x4200000000000000000000000000000000000006',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoUrl: 'https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/eth.svg',
    },
    {
        address: EVM_CONTRACT[DEFAULT_CHAINID].BTest,
        symbol: 'B139',
        name: 'B139',
        decimals: 18,
        logoUrl: 'https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/eth.svg',
    }
]

// WETH Arbitrum mainnet
// {
//     address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
//     symbol: 'ETH',
//     name: 'Ethereum',
//     decimals: 18,
//     logoUrl: 'https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/eth.svg',
// }
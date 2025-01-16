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
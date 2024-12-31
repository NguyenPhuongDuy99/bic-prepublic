import { Chain, Hex } from "viem";
import { unichainSepolia } from "viem/chains";

export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xA4e6267D961a6C818FBF038713A8cc071562dC9e',
        Pair: '0x0a1d695bD7EaBA89EdeCf9A3Cd9D969058D6f012'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xA4e6267D961a6C818FBF038713A8cc071562dC9e',
        Pair: '0x0a1d695bD7EaBA89EdeCf9A3Cd9D969058D6f012'
    },
    42161: {
        AccessManager: '0x',
    },
}

export const DEFAULT_CHAINID: string = '1301';

export const DEFAULT_CHAIN: Chain = unichainSepolia;

export const STORAGE_LOCATION: Hex = '0xd959cca23720948e5f992e1bef099a518994cc8b384c796f2b25ba30718fb300'

import { Chain, Hex } from "viem";
import { arbitrum, unichainSepolia } from "viem/chains";

export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xD8291CbF9130810a6C5FdbF954ef19a77c362354',
        Pair: '0xDdaEB7a97cAC324Be0F53799EC6a822FF90b17d7'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x8955Cea6d5d9a7eD18C44cF634dCd1b2F64af783',
        Pair: '0xe266048E8f5A1799fc1839C267293d6930a99Cfb'
    },
    42161: {
        UniswapRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
        BTest: '0x3A8f583b44fC86C32C192A377cb5e861310f869D',
        Pair: '0x43299f1147294c689d72785faeb3bb1d0b81a379'
    },
}

export const DEFAULT_CHAINID: string = '1301';

export const DEFAULT_CHAIN: Chain = unichainSepolia;

export const STORAGE_LOCATION: Hex = '0xd959cca23720948e5f992e1bef099a518994cc8b384c796f2b25ba30718fb300'

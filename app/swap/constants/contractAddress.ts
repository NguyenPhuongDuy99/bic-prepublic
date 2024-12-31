import { Chain, Hex } from "viem";
import { unichainSepolia } from "viem/chains";

export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x8955Cea6d5d9a7eD18C44cF634dCd1b2F64af783',
        Pair: '0xe266048E8f5A1799fc1839C267293d6930a99Cfb'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x8955Cea6d5d9a7eD18C44cF634dCd1b2F64af783',
        Pair: '0xe266048E8f5A1799fc1839C267293d6930a99Cfb'
    },
    42161: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x8955Cea6d5d9a7eD18C44cF634dCd1b2F64af783',
        Pair: '0xe266048E8f5A1799fc1839C267293d6930a99Cfb'
    },
}

export const DEFAULT_CHAINID: string = '1301';

export const DEFAULT_CHAIN: Chain = unichainSepolia;

export const STORAGE_LOCATION: Hex = '0xd959cca23720948e5f992e1bef099a518994cc8b384c796f2b25ba30718fb300'

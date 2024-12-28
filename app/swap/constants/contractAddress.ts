export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x8955Cea6d5d9a7eD18C44cF634dCd1b2F64af783',
        Pair: '0xe266048E8f5A1799fc1839C267293d6930a99Cfb'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xD9bC28C213d037BDd34308ED1e7Ce2cc3F5bA1e8',
        Pair: '0x0a1d695bD7EaBA89EdeCf9A3Cd9D969058D6f012'
    },
    42161: {
        AccessManager: '0x',
    },
}

export const DEFAULT_CHAINID: string = '1301';

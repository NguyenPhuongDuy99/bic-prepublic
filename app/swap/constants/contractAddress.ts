export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xD9bC28C213d037BDd34308ED1e7Ce2cc3F5bA1e8',
        Pair: '0xE7Df4d7870d57a08AAFb4c0949cfe33A0b454d91'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0xD9bC28C213d037BDd34308ED1e7Ce2cc3F5bA1e8',
        Pair: '0xE7Df4d7870d57a08AAFb4c0949cfe33A0b454d91'
    },
    42161: {
        AccessManager: '0x',
    },
}

export const DEFAULT_CHAINID: string = '1301';

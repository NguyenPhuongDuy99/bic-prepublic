export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x0a47730fFf34F604f472760BfB89C4bB14ed40E5'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x0a47730fFf34F604f472760BfB89C4bB14ed40E5'
    },
    42161: {
        AccessManager: '0x',
    },
}

export const DEFAULT_CHAINID: string = '1301';

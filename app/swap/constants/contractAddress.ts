export const NULL_ADDRESS: `0x${string}` = '0x0000000000000000000000000000000000000000'

export const EVM_CONTRACT: { [key: string]: {[key: string]: `0x${string}`} } = {
    1301: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x46c59c6319A38Efe643e76e710f2878D35ce7632',
        Pair: '0x6319bB026AC78cdd25B947F36c1f29D098bC2432'
    },
    421614: {
        UniswapRouter: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
        BTest: '0x46c59c6319A38Efe643e76e710f2878D35ce7632',
        Pair: '0x6319bB026AC78cdd25B947F36c1f29D098bC2432'
    },
    42161: {
        AccessManager: '0x',
    },
}

export const DEFAULT_CHAINID: string = '1301';

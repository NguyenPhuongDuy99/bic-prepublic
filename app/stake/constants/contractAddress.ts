import { Chain } from "viem";
import { arbitrumSepolia } from "viem/chains";

export const EVM_CONTRACT: { [key: string]: { [key: string]: `0x${string}` } } =
  {
    421614: {
      Bic: "0x1E3e1F2f400E72AE9944F906177E39c252348Fe4",
      StakingPool: "0x513Ec39d08c750318B7DF38Fc198B8750AAE615C",
    },
  }

export const DEFAULT_CHAINID = 421614;

export const DEFAULT_CHAIN: Chain = arbitrumSepolia;

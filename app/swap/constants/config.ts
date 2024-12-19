import { parseUnits } from "viem";

export const THRESHOLD: {[key: string]: any} = {
    MaxAllocation: parseUnits('888', 25),
    MinSwapBackAndLiquify: parseUnits('888', 23)
}
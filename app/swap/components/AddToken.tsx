"use client";

import { Button } from "@/components/ui";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { createWalletClient, custom } from "viem";
import { unichainSepolia } from "viem/chains";

export const AddToken = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  let walletClient: any
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    walletClient = createWalletClient({
      chain: unichainSepolia,
      transport: custom((window as any).ethereum!)
    })
  }

  const addToken = async () => {
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const success = await walletClient?.watchAsset({ 
        type: 'ERC20',
        options: {
          address: EVM_CONTRACT[DEFAULT_CHAINID].BTest,
          decimals: 18,
          symbol: 'B139',
        },
      })
  
      if (success) {
        console.log("Successful added token!")
      } else {
        console.log("Failed added token!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Button
        onClick={addToken}
        variant="accent"
      >Add B139</Button>
    </div>
  );
};

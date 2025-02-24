"use client";

import { Button } from "@beincom/web-ui";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";
import { createWalletClient, custom } from "viem";
import { unichainSepolia } from "viem/chains";
import { BIC_SYMBOL } from "../constants/tokenList";

export const AddToken = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  let walletClient: any;
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      chain: unichainSepolia,
      transport: custom((window as any).ethereum!),
    });
  }

  const addToken = async () => {
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const success = await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: EVM_CONTRACT[DEFAULT_CHAINID].BTest,
          decimals: 18,
          // symbol: BIC_SYMBOL,
        },
      });

      if (success) {
        console.log("Successful added token!");
      } else {
        console.log("Failed added token!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button onClick={addToken} size="lg">
        <span className="hidden md:inline text-base font-medium text-white">
          {`Add $${BIC_SYMBOL} to your Wallet`}
        </span>
        <span className="md:hidden text-sm font-medium text-white">
          {`Add $${BIC_SYMBOL}`}
        </span>
      </Button>
    </div>
  );
};

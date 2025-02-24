"use client";

import { ConnectButton as RainbowButton } from "@rainbow-me/rainbowkit";
import { Label } from "@/components/ui";
import { Button, ButtonProps } from "@beincom/web-ui";
import { ChevronDown } from "lucide-react";

type ConnectButton = {
  className?: string;
};

export const ConnectButton = ({ className }: ConnectButton) => {
  return (
    <RainbowButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;
        return (
          <div
            // className={cn(
            //   !ready && "pointer-events-none hidden select-none opacity-0",
            //   className,
            // )}
            aria-hidden={ready ? "false" : "true"}
          >
            {(() => {
              if (!connected) {
                return <HamburgerButton onClick={openConnectModal} size="xl" />;
              }
              // if (chain.unsupported) {
              //   return (
              //     <Button
              //       variant="bordered"
              //       onClick={openChainModal}
              //       type="button"
              //     >
              //       Wrong network
              //     </Button>
              //   );
              // }
              return (
                <div className="flex items-center gap-2 bg-purple-2 rounded-lg">
                  <Button onClick={openAccountModal} variant="ghost" size="xl">
                    <div className="flex items-center gap-2 text-base font-medium text-purple-50">
                      {account.displayName}
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </Button>
                  {/* <Button
                    variant="bordered"
                    onClick={openChainModal}
                    type="button"
                  >
                    Change network
                  </Button> */}
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowButton.Custom>
  );
};

const HamburgerButton = (props: ButtonProps) => {
  return (
    <Button {...props}>
      <Label className="text-base font-medium">Connect Wallet</Label>
    </Button>
  );
};

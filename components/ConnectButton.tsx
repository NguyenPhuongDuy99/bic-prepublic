"use client";

import { ConnectButton as RainbowButton } from "@rainbow-me/rainbowkit";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui";

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
            className={cn(
              !ready && "pointer-events-none hidden select-none opacity-0",
              className,
            )}
            aria-hidden={ready ? "false" : "true"}
          >
            {(() => {
              if (!connected) {
                return <HamburgerButton onClick={openConnectModal} />;
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant="bordered"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex items-center gap-2">
                  <Button
                    className="flex gap-1"
                    variant="bordered"
                    onClick={openAccountModal}
                  >
                    <span className="max-w-[120px] truncate">
                      {account.displayName}
                    </span>
                  </Button>
                  <Button
                    variant="bordered"
                    onClick={openChainModal}
                    type="button"
                  >
                    Change network
                  </Button>
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
    <Button
      variant="bordered"
      {...props}
    >
      <Label>Connect Wallet</Label>
    </Button>
  );
};

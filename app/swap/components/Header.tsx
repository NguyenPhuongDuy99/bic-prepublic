"use client";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { ConnectButton } from "@/components/ConnectButton";
import { InitRole } from "./InitRole";

export const Header = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const scrollPosition = useScrollPosition();

  return (
    <div
      className={cn(
        "fixed bg-background border-b border-transparent top-0 z-20 h-[72px] flex w-full items-center justify-between px-4 md:px-6",
        { "border-b-border": scrollPosition > 72 },
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-start gap-2">
        <h2 className="text-text font-extralight text-xl">B139 Pre-Public</h2>
      </div>

      <InitRole />

      <ConnectButton />
    </div>
  );
};

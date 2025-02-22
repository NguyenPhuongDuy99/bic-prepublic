"use client";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { ConnectButton } from "@/components/ConnectButton";
import Image from "next/image";
import logoIcon from "@/public/logo_beincomm_icon_and_text.webp";

export const Header = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const scrollPosition = useScrollPosition();

  return (
    <div
      className={cn(
        " bg-transparent border-b border-transparent top-0 z-20 flex w-full items-center justify-between p-4 md:px-6 bg-blur-md",
        { "border-b-border": scrollPosition > 72 },
        className,
      )}
      {...props}
    >
      <div className="relative flex flex-col items-end justify-center">
        <div className="flex flex-col items-center justify-end gap-2 w-[130px] h-[25px] md:w-[155px] md:h-[30px]">
          <Image
            src={logoIcon}
            alt="bic logo icon"
            width={155}
            height={30}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-[12px] font-medium text-[#444F8E] md:text-[14.7px] ">
          Pre-Public Sales
        </h2>
      </div>

      {/* <InitRole /> */}

      <ConnectButton />
    </div>
  );
};

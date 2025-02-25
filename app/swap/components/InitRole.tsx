"use client";

import { Button } from "@/components/ui";
import { useAccount } from "wagmi";
import { useGetController } from "../hooks/useGetController";

export const InitRole = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { address } = useAccount()
  const { controller } = useGetController({})

  return (
    <div>
      {address?.toLowerCase() == controller?.toLowerCase() && <Button
        disabled={true}
        variant="default"
        style={{ backgroundColor: 'red' }}
      >
        Owner
      </Button>}
    </div>
  );
};

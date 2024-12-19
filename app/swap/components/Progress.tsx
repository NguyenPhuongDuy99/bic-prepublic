import { LoadingIndicator, Status } from "@/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { Address, Hash, SimulateContractReturnType, TransactionReceipt } from "viem";

export type ExecutionProgress = TransactionProgress;
type ProgressMeta = ApproveMeta | undefined;
type ApproveMeta = {
    approvalAmount: bigint;
    spender: Address;
};
type TxRequest = Awaited<SimulateContractReturnType>["request"];


export type TransactionProgress = {
  step: "approve";
  status: "idle";
} | {
  step: "approve";
  status: "simulationPending";
  meta: ApproveMeta;
} | {
  step: "approve";
  status: "simulationSuccess";
  txRequest: TxRequest;
  meta: ApproveMeta;
} | {
  step: "approve";
  status: "txPending";
  txHash: Hash;
  meta: ApproveMeta;
} | {
  step: "approve";
  status: "txSuccess";
  txReceipt: TransactionReceipt;
  meta: ApproveMeta;
} | {
  step: "approve" | "deposit" | "fill";
  status: "simulationError" | "txError" | "error";
  error: Error;
  meta: ProgressMeta;
};

export type ProgressProps = {
  progress: ExecutionProgress;
  error?: Error | null;
  className?: string;
};

// TODO: make more fully featured
export function Progress({ progress, error, className }: ProgressProps) {
  if (progress.status === "idle") {
    return;
  }

  const status = (() => {
    if (
      progress.status === "txError" ||
      progress.status === "simulationError" ||
      progress.status === "error"
    ) {
      return Status.ERROR;
    }
    if (progress.status === "txSuccess") {
      return Status.SUCCESS;
    }
    return Status.PENDING;
  })();

  const label = (() => {
    if (
      progress.status === "txError" ||
      progress.status === "simulationError" ||
      progress.status === "error"
    ) {
      return progress.error.name;
    }
    if (progress.step === "approve") {
      return "Approving ERC20 spend...";
    }
  })();

  return (
    <div
      className={cn("px-2 w-full flex flex-col items-center gap-2", className)}
    >
      <p className="text-text/75 text-sm">{label}</p>
      <LoadingIndicator status={status} />
    </div>
  );
}

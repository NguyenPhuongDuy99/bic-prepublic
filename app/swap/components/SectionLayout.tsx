import { cn } from "@/lib/utils";

export default function SectionLayout({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("bg-white border p-4 w-full rounded-xl overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

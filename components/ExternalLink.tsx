import Link from "next/link";
import { Button, ButtonProps } from "@beincom/web-ui";
import { ExternalLink as ExternalLinkIcon } from "@beincom/web-icons";
import { cn } from "@/lib/utils";
export type ExternalLinkProps = {
  href: string;
  buttonProps?: ButtonProps;
  icon?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ExternalLinkButton({
  href,
  icon = false,
  className,
  buttonProps,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      href={href}
      className={cn("w-full", className)}
      {...props}
    >
      <Button
        type="ghost"
        variant="neutral"
        size="lg"
        className="w-full"
        {...buttonProps}
      >
        {children}
        {icon && <ExternalLinkIcon className="h-5 w-5 text-inherit ml-2" />}
      </Button>
    </Link>
  );
}

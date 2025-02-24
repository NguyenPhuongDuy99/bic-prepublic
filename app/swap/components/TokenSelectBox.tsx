import { Select, SelectOptionBase } from "@beincom/web-ui";
import { ChevronDownIcon } from "@beincom/web-icons";
import { TokenInfo } from "@/lib/utils";

interface TokenSelectBoxProps {
  token?: TokenInfo;
  options: TokenInfo[];
  onTokenChange: (token: TokenInfo) => void;
}

export function TokenSelectBox({
  token,
  options,
  onTokenChange,
}: TokenSelectBoxProps) {
  const selectOptions = options.map((token) => ({
    value: token.address,
    label: token.symbol,
    children: () => (
      <div className="flex w-full items-center gap-1">
        {token.logo}
        <div className="shrink-0 text-sm font-normal text-neutral-60">
          {token.symbol}
        </div>
      </div>
    ),
  }));

  return (
    <div className="min-w-28">
      <Select
        isMultiple={false}
        hideArrow
        boxRender={(value) => (
          <div className="flex items-center justify-between w-full p-2">
            <div className="shrink-0 text-sm font-medium text-neutral-60 flex items-center gap-1">
              {token?.logo}
              {value.label}
            </div>
            <ChevronDownIcon className="size-5 shrink-0 text-neutral-40" />
          </div>
        )}
        options={selectOptions}
        classNames={{
          selectBox:
            "px-0 py-2 hover:shadow-transparent focus:shadow-transparent shadow-transparent w-full",
          popoverContent: "min-w-40",
        }}
        value={{
          value: token?.address || "",
          label: token?.symbol || "",
        }}
        onChange={(value) => {
          const data = value as SelectOptionBase;
          const selectedToken = options.find(
            (i) => i.address.toLowerCase() === data.value.toLowerCase(),
          );
          if (selectedToken) onTokenChange(selectedToken);
        }}
      />
    </div>
  );
}

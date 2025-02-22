import { numericFormatter } from "react-number-format";

export const formatNumber = (value: string, decimalScale: number = 4) => {
  return numericFormatter(value, {
    thousandSeparator: true,
    decimalScale,
  });
};

import React from "react";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { Input, Label } from "@/components/ui";

interface FieldProps extends React.HTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  balance?: string;
}

const InputField = ({
  control,
  name,
  label,
  id,
  balance,
  ...props
}: FieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex-1 relative w-full">
            {label && (
              <div className="flex justify-between items-center">
                <Label htmlFor={id}>{label}</Label>
                <p>{balance}</p>
              </div>
            )}
            <Input id={id} {...props} {...field} />
            <FormMessage className="absolute left-0 top-full !mt-0" />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;

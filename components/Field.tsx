import React from "react";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { Input, InputRef } from "@beincom/web-ui";
import { Label } from "@/components/ui";

interface FieldProps extends React.RefAttributes<InputRef<HTMLInputElement>> {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
}

const InputField = ({ control, name, label, id, ...props }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex-1 relative">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input
              focused={undefined}
              filled={undefined}
              id={id}
              {...props}
              {...field}
            />
            <FormMessage className="absolute left-0 top-full" />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;

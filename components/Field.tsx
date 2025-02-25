import React from "react";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { FormLabel, Input, InputRef } from "@beincom/web-ui";

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
        console.log("field", field);
        return (
          <FormItem className="flex-1 relative">
            {label && <FormLabel required htmlFor={id}>{label}</FormLabel>}
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

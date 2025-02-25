"use client";
import Typograhphy from "@/components/Typograhphy";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui";
import { Button, Input } from "@beincom/web-ui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/Field";

const StakeBottom = () => {
  const dataTable = [
    {
      tier: 4,
      interest: "10%",
      capacity: "98M/100M",
    },
  ];

  const formSchema = z.object({
    amount: z.coerce.number({
      required_error: "Please fill in",
      invalid_type_error: "Amount must be a number",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit } = form;
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
  };

  return (
    <Card className="w-full rounded-xl">
      <CardContent className="p-6">
        <Typograhphy className="mb-5">Stake BIC</Typograhphy>
        <div className="flex">
          <div className="w-1/2">
            <Table className="max-w-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Current tier</TableHead>
                  <TableHead className="w-[200px]">Interest (ARP)</TableHead>
                  <TableHead>Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTable.map((data) => (
                  <TableRow key={data.tier}>
                    <TableCell className="text-neutral-60 text-base font-semibold leading-6">
                      {data.tier}
                    </TableCell>
                    <TableCell className="text-neutral-60 text-base font-semibold leading-6">
                      {data.interest}
                    </TableCell>
                    <TableCell className="text-neutral-60 text-base font-semibold leading-6">
                      {data.capacity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex-1 border border-transparent border-l-[#EAEDF2] pl-6">
            <Form {...form}>
              <form className="flex items-end w-full gap-4" autoComplete="off">
                <InputField
                  name="amount"
                  control={control}
                  label="Amount"
                  id="amount"
                />
                <Button onClick={handleSubmit(onSubmit)}>Stake</Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeBottom;

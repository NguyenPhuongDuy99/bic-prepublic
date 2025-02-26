"use client";
import Typograhphy from "@/components/Typograhphy";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Button } from "@beincom/web-ui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/Field";

const StakeBottom = () => {
  const dataTable = {
    tier: 4,
    interest: "10%",
    capacity: "98M/100M",
  };

  const listTitleData = {
    tier: "Current tier",
    interest: " Interest (ARP)",
    capacity: "Capacity",
  };

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
        <div className="flex-col sm:flex-row flex">
          <div className="w-full sm:w-1/2">
            {/* <Table className="max-w-[400px]">
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
            </Table> */}
            <div className="flex-col sm:flex-row flex gap-2 sm:gap-12">
              {Object.keys(dataTable).map((item, id) => (
                <div
                  className="flex sm:flex-col justify-between sm:justify-start gap-2"
                  key={id}
                >
                  <h3 className="text-neutral-30 text-sm">
                    {listTitleData[item as keyof typeof listTitleData]}
                  </h3>
                  <p className="text-neutral-60 text-sm font-semibold">
                    {dataTable[item as keyof typeof dataTable]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 border border-transparent border-t-[#EAEDF2] sm:border-l-[#EAEDF2] sm:border-t-0 sm:pl-6 pt-3 sm:pt-0 mt-4 sm:mt-0">
            <Form {...form}>
              <form
                className="flex-col sm:flex-row flex items-end w-full gap-5 sm:gap-4"
                autoComplete="off"
              >
                <InputField
                  name="amount"
                  control={control}
                  label="Amount"
                  id="amount"
                  placeholder="Enter amount"
                  className="flex-shrink-0"
                />
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full sm:w-auto h-10"
                >
                  Stake
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakeBottom;

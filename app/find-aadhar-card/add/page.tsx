"use client";

import React from "react";
import CustomField from "@/components/reusableComponents/customField";
import CustomTextarea from "@/components/reusableComponents/customTextarea";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";

const schema = z.object({
  personName: z.string().min(1, "Person name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  attachmentSlip: z.any().optional(),
  remarks: z.string().optional(),
  findAadhaarCharge: z.coerce
    .number()
    .min(0, "Find Aadhaar charge is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type FindAadhaarFormData = z.infer<typeof schema>;

function Page() {
  const form = useForm<FindAadhaarFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      personName: "",
      mobileNumber: "",
      attachmentSlip: undefined,
      remarks: "",
      findAadhaarCharge: 500,
      totalCharge: 500,
    },
  });

  const findAadhaarCharge = useWatch({
    control: form.control,
    name: "findAadhaarCharge",
  });

  React.useEffect(() => {
    form.setValue("totalCharge", Number(findAadhaarCharge || 0), {
      shouldValidate: true,
    });
  }, [findAadhaarCharge, form]);

  const onSubmit = (data: FindAadhaarFormData) => {
    console.log("Find Aadhaar submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Find Aadhar Add</h1>
        <Button type="button" variant="outline">
          Find Aadhar List
        </Button>
      </div>
      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="personName"
                  label="Person Name"
                  placeholder="Person Name"
                  isLoading={false}
                />
                <CustomField
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  isLoading={false}
                />
              </div>

              <FormField
                control={form.control}
                name="attachmentSlip"
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Attachment Slip</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...rest}
                          onChange={(event) =>
                            onChange(event.target.files?.[0] ?? null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <CustomTextarea
                name="remarks"
                label="Remarks"
                placeholder="Remarks..."
                isLoading={false}
              />

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-3 md:grid-cols-2">
                  <CustomField
                    name="findAadhaarCharge"
                    label="Find Aadhaar"
                    placeholder="0"
                    type="number"
                    disabled
                    isLoading={false}
                  />
                  <CustomField
                    name="totalCharge"
                    label="Total"
                    placeholder="0"
                    type="number"
                    disabled
                    isLoading={false}
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

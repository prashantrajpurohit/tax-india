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
import { Checkbox } from "@/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";

const schema = z.object({
  personName: z.string().min(1, "Person name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  printOption: z.string().min(1, "Print option is required"),
  attachmentFile: z.any().optional(),
  attachmentPassword: z.string().optional(),
  comments: z.string().optional(),
  editPvcApplication: z.boolean(),
  pvcPrintCharge: z.coerce.number().min(0, "PVC print charge is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type PvcFormData = z.infer<typeof schema>;

const printOptions = ["PVC Print", "PAN Print", "Aadhaar Print"];

function Page() {
  const form = useForm<PvcFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      personName: "",
      mobileNumber: "",
      printOption: "",
      attachmentFile: undefined,
      attachmentPassword: "",
      comments: "",
      editPvcApplication: false,
      pvcPrintCharge: 35,
      totalCharge: 35,
    },
  });

  const pvcPrintCharge = useWatch({
    control: form.control,
    name: "pvcPrintCharge",
  });

  React.useEffect(() => {
    form.setValue("totalCharge", Number(pvcPrintCharge || 0), {
      shouldValidate: true,
    });
  }, [pvcPrintCharge, form]);

  const onSubmit = (data: PvcFormData) => {
    console.log("PVC print application submitted", data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/print-pvc">Print PVC</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Add New Print Application</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new print request with attachment details and charges.
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="py-6">
          <FormProvider {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <CustomField
                  name="printOption"
                  label="Print Option"
                  placeholder="Select Print Option"
                  select
                  options={printOptions}
                  isLoading={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
                <FormField
                  control={form.control}
                  name="attachmentFile"
                  render={({ field }) => {
                    const { onChange, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Upload Attachment</FormLabel>
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
                <CustomField
                  name="attachmentPassword"
                  label="Password Of Attachment"
                  placeholder="Password Of Attachment"
                  isLoading={false}
                />
              </div>

              <CustomTextarea
                name="comments"
                label="Any Comments"
                placeholder="Comment..."
                isLoading={false}
              />

              <FormField
                control={form.control}
                name="editPvcApplication"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-lg font-semibold text-red-600">
                      Edit PVC Print Application
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-6 px-4 pb-6 pt-4 md:grid-cols-2">
                  <CustomField
                    name="pvcPrintCharge"
                    label="PVC Print Application"
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

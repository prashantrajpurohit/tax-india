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
  voterCardNumber: z.string().min(1, "Voter card number is required"),
  uploadFile: z.any().optional(),
  address: z.string().min(1, "Address is required"),
  voterDownloadCharge: z.coerce
    .number()
    .min(0, "Voter card download charge is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type VoterFormData = z.infer<typeof schema>;

function Page() {
  const form = useForm<VoterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      voterCardNumber: "",
      uploadFile: undefined,
      address: "",
      voterDownloadCharge: 50,
      totalCharge: 50,
    },
  });

  const voterDownloadCharge = useWatch({
    control: form.control,
    name: "voterDownloadCharge",
  });

  React.useEffect(() => {
    form.setValue("totalCharge", Number(voterDownloadCharge || 0), {
      shouldValidate: true,
    });
  }, [voterDownloadCharge, form]);

  const onSubmit = (data: VoterFormData) => {
    console.log("Voter card download submitted", data);
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
                <Link to="/download-voter-card">Voter Card Download</Link>
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
            <h1 className="text-2xl font-semibold">Add New Voter Card</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add voter card details and upload documents for download.
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="py-6">
          <FormProvider {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <CustomField
                name="voterCardNumber"
                label="Enter Voter Card Number"
                placeholder="Voter Card Number"
                isLoading={false}
              />

              <FormField
                control={form.control}
                name="uploadFile"
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Upload Files</FormLabel>
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
                name="address"
                label="Enter Address as per Voter Card"
                placeholder="Address..."
                isLoading={false}
              />

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-6 px-4 pb-6 pt-4 md:grid-cols-2">
                  <CustomField
                    name="voterDownloadCharge"
                    label="Voter Card Download"
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

              <div className="flex justify-center">
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

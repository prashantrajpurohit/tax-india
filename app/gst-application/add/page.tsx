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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";

const schema = z.object({
  contactPersonName: z.string().min(1, "Contact person name is required"),
  firmName: z.string().min(1, "Firm name is required"),
  customerEmail: z.string().email("Valid email is required"),
  mobileNo: z.string().min(1, "Mobile number is required"),
  entityType: z.string().min(1, "Type of entity is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  businessActivity: z.string().min(1, "Nature of business activity is required"),
  placeOfBusiness: z.string().min(1, "Place of business is required"),
  comments: z.string().optional(),
  passportPhoto: z.any().optional(),
  otherDocument: z.any().optional(),
  docPancard: z.boolean().default(false),
  docAadhaar: z.boolean().default(false),
  docBankProof: z.boolean().default(false),
  gstRegistrationCharge: z.coerce
    .number()
    .min(0, "GST registration charge is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type GstFormData = z.infer<typeof schema>;

const entityOptions = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Public Limited",
];
const placeOptions = ["Commercial", "Residential", "Industrial", "Other"];

function Page() {
  const form = useForm<GstFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactPersonName: "",
      firmName: "",
      customerEmail: "",
      mobileNo: "",
      entityType: "",
      businessAddress: "",
      city: "",
      pincode: "",
      bankAccountNumber: "",
      ifscCode: "",
      businessActivity: "",
      placeOfBusiness: "",
      comments: "",
      passportPhoto: undefined,
      otherDocument: undefined,
      docPancard: false,
      docAadhaar: false,
      docBankProof: false,
      gstRegistrationCharge: 200,
      totalCharge: 200,
    },
  });

  const gstRegistrationCharge = useWatch({
    control: form.control,
    name: "gstRegistrationCharge",
  });

  React.useEffect(() => {
    const totalValue = Number(gstRegistrationCharge || 0);
    form.setValue("totalCharge", totalValue, { shouldValidate: true });
  }, [gstRegistrationCharge, form]);

  const onSubmit = (data: GstFormData) => {
    console.log("GST application submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">GST Registration Form</h1>
        <Button type="button" variant="outline">
          View GST Application List
        </Button>
      </div>
      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CustomField
                  name="contactPersonName"
                  label="Name of Contact Person"
                  placeholder="Enter name of contact person"
                  isLoading={false}
                />
                <CustomField
                  name="firmName"
                  label="Name of Firm"
                  placeholder="Enter name of firm"
                  isLoading={false}
                />
                <CustomField
                  name="customerEmail"
                  label="Customer's Email"
                  placeholder="Enter customer email"
                  isLoading={false}
                />
                <CustomField
                  name="mobileNo"
                  label="Mobile No"
                  placeholder="+91"
                  isLoading={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="entityType"
                  label="Type of Entity"
                  placeholder="Select"
                  select
                  options={entityOptions}
                  isLoading={false}
                />
                <CustomField
                  name="businessAddress"
                  label="Business Address"
                  placeholder="Enter complete address of place of business"
                  isLoading={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="city"
                  label="City"
                  placeholder="Enter city"
                  isLoading={false}
                />
                <CustomField
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter pincode"
                  isLoading={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="bankAccountNumber"
                  label="Bank Account Number"
                  placeholder="Enter bank account number"
                  isLoading={false}
                />
                <CustomField
                  name="ifscCode"
                  label="IFSC Code"
                  placeholder="Enter IFSC code"
                  isLoading={false}
                />
              </div>

              <CustomTextarea
                name="businessActivity"
                label="Nature of Business Activity"
                placeholder="Enter nature of business activity"
                isLoading={false}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="placeOfBusiness"
                  label="Whether Place of Business is"
                  placeholder="Select"
                  select
                  options={placeOptions}
                  isLoading={false}
                />
                <CustomTextarea
                  name="comments"
                  label="Any Comments"
                  placeholder="Enter any comments"
                  isLoading={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="passportPhoto"
                  render={({ field }) => {
                    const { onChange, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>
                          Upload Passport Size photo (only jpg,jpeg file)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg"
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
                <FormField
                  control={form.control}
                  name="otherDocument"
                  render={({ field }) => {
                    const { onChange, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>
                          Upload Other document (only pdf file)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
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
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold">
                  Please confirm that you have attached the following documents
                </h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {[
                    { name: "docPancard", label: "Pancard" },
                    { name: "docAadhaar", label: "Aadhar card" },
                    {
                      name: "docBankProof",
                      label: "Bank Passbook/Statement OR Cancelled Cheque",
                    },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof GstFormData}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={Boolean(field.value)}
                              onCheckedChange={(checked) =>
                                field.onChange(Boolean(checked))
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-3 md:grid-cols-2">
                  <CustomField
                    name="gstRegistrationCharge"
                    label="GST Registration Charge"
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
                <Button type="submit" variant="destructive">
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

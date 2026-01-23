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
  assessmentYear: z.string().min(1, "Assessment year is required"),
  eVerifyCharge: z.string().min(1, "E-verify charge is required"),
  nameAsPerPan: z.string().min(1, "Name as per PAN is required"),
  fatherName: z.string().min(1, "Father name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  taxPayable: z.coerce.number().min(0, "Tax payable is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string().min(1, "IFSC code is required"),
  mobileNo: z.string().min(1, "Mobile number is required"),
  panNumber: z.string().min(1, "PAN number is required"),
  aadhaarNumber: z.string().min(1, "Aadhaar number is required"),
  proofPanCard: z.boolean().default(false),
  proofOldItrCopy: z.boolean().default(false),
  proofForm16: z.boolean().default(false),
  proofOthers: z.boolean().default(false),
  proofAadhaarCard: z.boolean().default(false),
  proof80cDoc: z.boolean().default(false),
  proofJForm: z.boolean().default(false),
  uploadDocs: z.any().optional(),
  comments: z.string().optional(),
  oldItr: z.boolean().default(false),
  itrApplicationCharge: z.coerce.number().min(0, "ITR charge is required"),
  eVerifyFee: z.coerce.number().min(0, "E-verify fee is required"),
  payableTax: z.coerce.number().min(0, "Payable tax is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type ItrFormData = z.infer<typeof schema>;

const assessmentYearOptions = ["2024-2025", "2023-2024", "2022-2023"];
const eVerifyOptions = [
  { label: "E-verify (95)", value: "95" },
  { label: "No E-verify (0)", value: "0" },
];

function Page() {
  const form = useForm<ItrFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      assessmentYear: "2024-2025",
      eVerifyCharge: "",
      nameAsPerPan: "",
      fatherName: "",
      dob: "",
      taxPayable: 0,
      accountNumber: "",
      ifsc: "",
      mobileNo: "",
      panNumber: "",
      aadhaarNumber: "",
      proofPanCard: false,
      proofOldItrCopy: false,
      proofForm16: false,
      proofOthers: false,
      proofAadhaarCard: false,
      proof80cDoc: false,
      proofJForm: false,
      uploadDocs: undefined,
      comments: "",
      oldItr: false,
      itrApplicationCharge: 95,
      eVerifyFee: 0,
      payableTax: 0,
      totalCharge: 95,
    },
  });

  const taxPayable = useWatch({ control: form.control, name: "taxPayable" });
  const eVerifyCharge = useWatch({
    control: form.control,
    name: "eVerifyCharge",
  });
  const itrApplicationCharge = useWatch({
    control: form.control,
    name: "itrApplicationCharge",
  });
  const eVerifyFee = useWatch({ control: form.control, name: "eVerifyFee" });
  const payableTax = useWatch({ control: form.control, name: "payableTax" });

  React.useEffect(() => {
    const value = Number(taxPayable || 0);
    form.setValue("payableTax", Number.isFinite(value) ? value : 0, {
      shouldValidate: true,
    });
  }, [taxPayable, form]);

  React.useEffect(() => {
    const value = Number(eVerifyCharge || 0);
    form.setValue("eVerifyFee", Number.isFinite(value) ? value : 0, {
      shouldValidate: true,
    });
  }, [eVerifyCharge, form]);

  React.useEffect(() => {
    const total =
      Number(itrApplicationCharge || 0) +
      Number(eVerifyFee || 0) +
      Number(payableTax || 0);
    form.setValue("totalCharge", total, { shouldValidate: true });
  }, [itrApplicationCharge, eVerifyFee, payableTax, form]);

  const onSubmit = (data: ItrFormData) => {
    console.log("ITR application submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Add New ITR Application</h1>
        <Button type="button" variant="outline">
          ITR Application List
        </Button>
      </div>
      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="assessmentYear"
                  label="Select Assessment Year"
                  placeholder="Select Assessment Year"
                  select
                  options={assessmentYearOptions}
                  isLoading={false}
                />
                <CustomField
                  name="eVerifyCharge"
                  label="E-Verify Charge"
                  placeholder="Select E-verify"
                  select
                  options={eVerifyOptions}
                  isLoading={false}
                />
                <CustomField
                  name="nameAsPerPan"
                  label="Name as per PAN"
                  placeholder="Enter name as per PAN"
                  isLoading={false}
                />
                <CustomField
                  name="fatherName"
                  label="Father Name"
                  placeholder="Enter father name"
                  isLoading={false}
                />
                <CustomField
                  name="dob"
                  label="DOB"
                  placeholder="Enter date of birth"
                  type="date"
                  isLoading={false}
                />
                <CustomField
                  name="taxPayable"
                  label="Tax Payable"
                  placeholder="0"
                  type="number"
                  isLoading={false}
                />
                <CustomField
                  name="accountNumber"
                  label="Account Number"
                  placeholder="Enter account number"
                  isLoading={false}
                />
                <CustomField
                  name="ifsc"
                  label="IFSC"
                  placeholder="Enter account IFSC code"
                  isLoading={false}
                />
                <CustomField
                  name="mobileNo"
                  label="Mobile No"
                  placeholder="Enter mobile number"
                  isLoading={false}
                />
                <CustomField
                  name="panNumber"
                  label="PAN Number"
                  placeholder="Enter PAN number"
                  isLoading={false}
                />
                <CustomField
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  placeholder="Enter Aadhaar number"
                  isLoading={false}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold">Proof Attached</h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="proofPanCard"
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
                        <FormLabel className="font-normal">Pan Card</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofAadhaarCard"
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
                        <FormLabel className="font-normal">
                          Aadhaar Card
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofOldItrCopy"
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
                        <FormLabel className="font-normal">
                          Old ITR Copy
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proof80cDoc"
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
                        <FormLabel className="font-normal">80C Document</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofForm16"
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
                        <FormLabel className="font-normal">Form 16</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofJForm"
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
                        <FormLabel className="font-normal">J Form</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proofOthers"
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
                        <FormLabel className="font-normal">Others</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="uploadDocs"
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Upload Docs</FormLabel>
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
                name="comments"
                label="Any Comments"
                placeholder="Message..."
                isLoading={false}
              />

              <FormField
                control={form.control}
                name="oldItr"
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
                    <FormLabel className="font-semibold uppercase text-red-600">
                      Old ITR
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-3 md:grid-cols-2">
                  <CustomField
                    name="itrApplicationCharge"
                    label="ITR Application"
                    placeholder="0"
                    type="number"
                    disabled
                    isLoading={false}
                  />
                  <CustomField
                    name="eVerifyFee"
                    label="E-verify"
                    placeholder="0"
                    type="number"
                    disabled
                    isLoading={false}
                  />
                  <CustomField
                    name="payableTax"
                    label="Payable Tax"
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

              <div className="flex justify-end">
                <Button type="submit">Submit ITR</Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

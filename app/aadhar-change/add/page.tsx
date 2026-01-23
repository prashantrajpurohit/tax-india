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
  aadhaarNumber: z.string().min(1, "Aadhaar number is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  aadhaarPhoto: z.any().optional(),
  userPhoto: z.any().optional(),
  changeName: z.boolean().default(false),
  changeGender: z.boolean().default(false),
  changeDob: z.boolean().default(false),
  changeFatherName: z.boolean().default(false),
  changeMobile: z.boolean().default(false),
  changeAddress: z.boolean().default(false),
  name: z.string().optional(),
  fatherName: z.string().optional(),
  dob: z.string().optional(),
  updatedMobile: z.string().optional(),
  identifierNumber: z.string().min(1, "Identifier number is required"),
  gender: z.enum(["male", "female", "other"]).optional(),
  newAddress: z.string().optional(),
  correctionCharge: z.coerce.number().min(0, "Correction charge is required"),
  totalCharge: z.coerce.number().min(0, "Total charge is required"),
});

type AadhaarFormData = z.infer<typeof schema>;

function Page() {
  const form = useForm<AadhaarFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      aadhaarNumber: "",
      mobileNumber: "",
      aadhaarPhoto: undefined,
      userPhoto: undefined,
      changeName: false,
      changeGender: false,
      changeDob: false,
      changeFatherName: false,
      changeMobile: false,
      changeAddress: false,
      name: "",
      fatherName: "",
      dob: "",
      updatedMobile: "",
      identifierNumber: "",
      gender: undefined,
      newAddress: "",
      correctionCharge: 230,
      totalCharge: 230,
    },
  });

  const correctionCharge = useWatch({
    control: form.control,
    name: "correctionCharge",
  });

  React.useEffect(() => {
    form.setValue("totalCharge", Number(correctionCharge || 0), {
      shouldValidate: true,
    });
  }, [correctionCharge, form]);

  const onSubmit = (data: AadhaarFormData) => {
    console.log("Aadhaar change submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Add New Aadhaar</h1>
        <Button type="button" variant="outline">
          View Aadhaar List
        </Button>
      </div>
      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  placeholder="Aadhaar Number"
                  isLoading={false}
                />
                <CustomField
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  isLoading={false}
                />
                <FormField
                  control={form.control}
                  name="aadhaarPhoto"
                  render={({ field }) => {
                    const { onChange, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Upload Aadhaar Photo</FormLabel>
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
                        <p className="text-xs text-red-600">
                          Please upload only current Aadhaar card photo.
                        </p>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="userPhoto"
                  render={({ field }) => {
                    const { onChange, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Upload Your Photo</FormLabel>
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
                        <p className="text-xs text-red-600">
                          Please upload only your current photo.
                        </p>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold">Change On Aadhaar Card</h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {[
                    { name: "changeName", label: "Name" },
                    { name: "changeFatherName", label: "Father Name" },
                    { name: "changeGender", label: "Gender" },
                    { name: "changeMobile", label: "Mobile Number" },
                    { name: "changeDob", label: "Date of Birth" },
                    { name: "changeAddress", label: "Address" },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof AadhaarFormData}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <CustomField
                    name="name"
                    label="Your Name"
                    placeholder="Your Name"
                    isLoading={false}
                  />
                  <p className="text-xs text-red-600">
                    Please write only changed Aadhaar card name.
                  </p>
                </div>
                <div className="space-y-1">
                  <CustomField
                    name="fatherName"
                    label="Your Father Name"
                    placeholder="Your Father Name"
                    isLoading={false}
                  />
                  <p className="text-xs text-red-600">
                    Please write only changed Aadhaar card father name.
                  </p>
                </div>
                <div className="space-y-1">
                  <CustomField
                    name="dob"
                    label="Date Of Birth"
                    placeholder="Date Of Birth"
                    isLoading={false}
                  />
                  <p className="text-xs text-red-600">
                    Please write only changed Aadhaar card date of birth.
                  </p>
                </div>
                <div className="space-y-1">
                  <CustomField
                    name="updatedMobile"
                    label="Mobile Number"
                    placeholder="Mobile Number"
                    isLoading={false}
                  />
                  <p className="text-xs text-red-600">
                    Please write only changed Aadhaar card mobile number.
                  </p>
                </div>
                <div className="space-y-1">
                  <CustomField
                    name="identifierNumber"
                    label="Identifier Number"
                    placeholder="Identifier Number"
                    isLoading={false}
                  />
                  <p className="text-xs text-red-600">
                    Pan Card or Voter Card number only.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Gender</FormLabel>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            className="h-4 w-4"
                            checked={field.value === "male"}
                            onChange={() => field.onChange("male")}
                          />
                          Male
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            className="h-4 w-4"
                            checked={field.value === "female"}
                            onChange={() => field.onChange("female")}
                          />
                          Female
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            className="h-4 w-4"
                            checked={field.value === "other"}
                            onChange={() => field.onChange("other")}
                          />
                          Interrelationship
                        </label>
                      </div>
                      <p className="text-xs text-red-600">
                        Please select only changed Aadhaar card gender.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <CustomTextarea
                  name="newAddress"
                  label="New Address"
                  placeholder="New Address..."
                  isLoading={false}
                />
                <p className="text-xs text-red-600">
                  Please write only new Aadhaar card address.
                </p>
              </div>

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Total Charges
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-3 md:grid-cols-2">
                  <CustomField
                    name="correctionCharge"
                    label="Aadhaar Card Correction"
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

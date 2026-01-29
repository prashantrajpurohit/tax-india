"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { PancardApis } from "@/app/pan-application/controller";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  filledComplete: z.enum(["yes", "no"]),
  applicationType: z.enum(["new", "change"]),
  deliveryType: z.enum(["e-pan", "both"]),
  customerName: z.string().min(1, "Customer name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  email: z.string().email("Valid email is required"),
  mobileNo: z.string().min(1, "Mobile number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  aadhaarNumber: z.string().min(1, "Aadhaar number is required"),
  agencyType: z.string().min(1, "Agency type is required"),
  agencyTypeSecondary: z.string().min(1, "Agency type is required"),
  proofDrivingLicense: z.boolean(),
  proofVoterCard: z.boolean(),
  proofPassport: z.boolean(),
  proofTenthCertificate: z.boolean(),
  proofAadhaarCard: z.boolean(),
  proofDeliverInShop: z.boolean(),
  proofAffidavitDob: z.boolean(),
  proofNotaryTest: z.boolean(),
  proofBirthCertificate: z.boolean(),
  proofNotApplicable: z.boolean(),
  proofGazetteNameChange: z.boolean(),
  proofGazetteFatherName: z.boolean(),
  aadhaarFront: z.any().optional(),
  aadhaarBack: z.any().optional(),
  photo: z.any().optional(),
  signature: z.any().optional(),
  otherDocument: z.any().optional(),
  otherProof: z.any().optional(),
  comments: z.string().optional(),
  panApplicationFee: z.coerce
    .number()
    .min(0, "PAN application fee is required"),
  convenienceFee: z.coerce.number().min(0, "Convenience fee is required"),
  subtotal: z.coerce.number().min(0, "Subtotal is required"),
  total: z.coerce.number().min(0, "Total is required"),
});

type PanFormData = z.infer<typeof schema>;

const agencyOptions = ["UTI", "NSDL"];

function Page() {
  const navigate = useNavigate();
  const { addPancard, editPancard } = new PancardApis();
  const { search } = useLocation();
  const editId = React.useMemo(
    () => new URLSearchParams(search).get("id"),
    [search],
  );
  const form = useForm<PanFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      filledComplete: "no",
      applicationType: "new",
      deliveryType: "e-pan",
      customerName: "",
      fatherName: "",
      email: "",
      mobileNo: "",
      dob: "",
      aadhaarNumber: "",
      agencyType: "UTI",
      agencyTypeSecondary: "UTI",
      proofDrivingLicense: false,
      proofVoterCard: false,
      proofPassport: false,
      proofTenthCertificate: false,
      proofAadhaarCard: false,
      proofDeliverInShop: false,
      proofAffidavitDob: false,
      proofNotaryTest: false,
      proofBirthCertificate: false,
      proofNotApplicable: false,
      proofGazetteNameChange: false,
      proofGazetteFatherName: false,
      aadhaarFront: undefined,
      aadhaarBack: undefined,
      photo: undefined,
      signature: undefined,
      otherDocument: undefined,
      otherProof: undefined,
      comments: "",
      panApplicationFee: 10,
      convenienceFee: 13,
      subtotal: 23,
      total: 23,
    },
  });

  const panApplicationFee = useWatch({
    control: form.control,
    name: "panApplicationFee",
  });
  const convenienceFee = useWatch({
    control: form.control,
    name: "convenienceFee",
  });
  const agencyType = useWatch({ control: form.control, name: "agencyType" });

  React.useEffect(() => {
    form.setValue("agencyTypeSecondary", agencyType || "UTI", {
      shouldValidate: true,
    });
  }, [agencyType, form]);

  React.useEffect(() => {
    const subtotalValue =
      Number(panApplicationFee || 0) + Number(convenienceFee || 0);
    form.setValue("subtotal", subtotalValue, { shouldValidate: true });
    form.setValue("total", subtotalValue, { shouldValidate: true });
  }, [panApplicationFee, convenienceFee, form]);

  const submitMutation = useMutation({
    mutationFn: async ({
      payload,
      editId: currentEditId,
    }: {
      payload: Record<string, string>;
      editId: string | null;
    }) => {
      if (currentEditId) {
        return editPancard({
          body: payload,
          id: encodeURIComponent(currentEditId),
        });
      }
      return addPancard(payload);
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.editId
          ? "PAN application updated"
          : "PAN application created",
      );
      navigate("/pan-application");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Request failed");
    },
  });

  const onSubmit = async (data: PanFormData) => {
    const payload = {
      id: editId ?? undefined,
      assementyear: "",
      everify: "",
      name: data.customerName,
      father_name: data.fatherName,
      dob: data.dob,
      taxpayble: "",
      account_number: "",
      ifsc: "",
      panno: "",
      mobile: data.mobileNo,
      adhaarno: data.aadhaarNumber,
      itrcharge: "",
      everifyt: "",
      itr_fee: "",
      payable_tax_fee: "",
      olt_itr_fee: "",
      totalamt: String(data.total ?? ""),
      proof: "",
      itr_application: "",
      message: data.comments ?? "",
      pan_application_form_filled_fees: String(data.panApplicationFee ?? ""),
    };

    await submitMutation.mutateAsync({
      payload: Object.fromEntries(
        Object.entries(payload).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      ) as Record<string, string>,
      editId,
    });
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
                <Link to="/pan-application">PAN Application</Link>
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
            <h1 className="text-2xl font-semibold">
              {editId ? "Update Pan Card" : "Add New Pan Card"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Capture applicant details and documents to submit a PAN request.
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <FormProvider {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm">
                  Important Links and Download Forms
                </Button>
              </div> */}

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground border-b pb-2">
                  Application Details
                </h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="filledComplete"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          Whether PAN application form is filled completely?
                        </FormLabel>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "yes"}
                              onChange={() => field.onChange("yes")}
                            />
                            Yes - ₹ 10
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "no"}
                              onChange={() => field.onChange("no")}
                            />
                            No
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Type of Application</FormLabel>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "new"}
                              onChange={() => field.onChange("new")}
                            />
                            New
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "change"}
                              onChange={() => field.onChange("change")}
                            />
                            Change/Reissue/Correction in PAN
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Delivery Type</FormLabel>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "e-pan"}
                              onChange={() => field.onChange("e-pan")}
                            />
                            Only E-PAN - ₹ 35
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              className="h-4 w-4"
                              checked={field.value === "both"}
                              onChange={() => field.onChange("both")}
                            />
                            Both E-PAN and Physical PAN
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground border-b pb-2">
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <CustomField
                    name="customerName"
                    label="Customer Name"
                    placeholder="Customer Name"
                    isLoading={false}
                  />
                  <CustomField
                    name="fatherName"
                    label="Father's Name"
                    placeholder="Enter father name"
                    isLoading={false}
                  />
                  <div className="space-y-1">
                    <CustomField
                      name="email"
                      label="Customer's Email"
                      placeholder="Enter customer email"
                      isLoading={false}
                    />
                    <p className="text-xs text-muted-foreground">
                      Please provide customer's email address only.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <CustomField
                      name="mobileNo"
                      label="Mobile No"
                      placeholder="+91"
                      isLoading={false}
                    />
                    <p className="text-xs text-muted-foreground">
                      Please provide customer's mobile number only.
                    </p>
                  </div>
                  <CustomField
                    name="dob"
                    label="Date of Birth (DD/MM/YYYY)"
                    placeholder="dd/mm/yyyy"
                    isLoading={false}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-foreground border-b pb-2">
                    Proofs Attached
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: "proofDrivingLicense", label: "Driving License" },
                      { name: "proofVoterCard", label: "Voter Card" },
                      { name: "proofPassport", label: "Passport" },
                      {
                        name: "proofTenthCertificate",
                        label: "10th Certificate",
                      },
                      { name: "proofAadhaarCard", label: "Aadhaar Card" },
                      {
                        name: "proofDeliverInShop",
                        label: "Deliver In Shop + ₹ 50",
                      },
                      {
                        name: "proofAffidavitDob",
                        label: "Affidavit for Date of Birth + ₹ 60",
                      },
                      { name: "proofNotaryTest", label: "Notary Test + ₹ 50" },
                      {
                        name: "proofBirthCertificate",
                        label: "Birth Certificate",
                      },
                      { name: "proofNotApplicable", label: "Not Applicable" },
                      {
                        name: "proofGazetteNameChange",
                        label: "Name Correction ₹100",
                      },
                      {
                        name: "proofGazetteFatherName",
                        label: "Father's Name Correction ₹100",
                      },
                    ].map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name as keyof PanFormData}
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

                <div className="space-y-5">
                  <CustomField
                    name="aadhaarNumber"
                    label="Aadhaar Number"
                    placeholder="XXXX-XXXX-XXXX"
                    isLoading={false}
                  />
                  <CustomField
                    name="agencyType"
                    label="Agency Type"
                    placeholder="Select agency"
                    select
                    options={agencyOptions}
                    isLoading={false}
                  />
                </div>

                <div className="space-y-4" />
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground border-b pb-2">
                  Document Uploads
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    { name: "aadhaarFront", label: "Aadhaar Card Front" },
                    { name: "aadhaarBack", label: "Aadhaar Card Back" },
                    { name: "photo", label: "Photo" },
                    { name: "signature", label: "Signature" },
                    { name: "otherDocument", label: "Other Document" },
                    { name: "otherProof", label: "Other Proof" },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof PanFormData}
                      render={({ field }) => {
                        const { onChange, ...rest } = field;
                        return (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
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
                  ))}
                </div>
              </div>

              <div className="max-w-md">
                <CustomField
                  name="agencyTypeSecondary"
                  label="Agency Type"
                  placeholder="Select agency"
                  select
                  options={agencyOptions}
                  isLoading={false}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground border-b pb-2">
                  Comments
                </h2>
                <CustomTextarea
                  name="comments"
                  label="Any Comments"
                  placeholder=""
                  isLoading={false}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground border-b pb-2">
                  Your Order Summary
                </h2>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-1 gap-6 border-b px-4 py-4 md:grid-cols-2">
                    <CustomField
                      name="panApplicationFee"
                      label="PAN Application x 1"
                      placeholder="0"
                      type="number"
                      disabled
                      isLoading={false}
                    />
                    <CustomField
                      name="convenienceFee"
                      label="Convenience fees"
                      placeholder="0"
                      type="number"
                      disabled
                      isLoading={false}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 border-b px-4 py-4 md:grid-cols-2">
                    <CustomField
                      name="subtotal"
                      label="Subtotal"
                      placeholder="0"
                      type="number"
                      disabled
                      isLoading={false}
                    />
                    <CustomField
                      name="total"
                      label="Total"
                      placeholder="0"
                      type="number"
                      disabled
                      isLoading={false}
                    />
                  </div>
                </div>
                <p className="text-xs text-red-600">
                  Note: Make sure all mandatory fields (marked with *) are
                  filled.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Saving..." : "Submit"}
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

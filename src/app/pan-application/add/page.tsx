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
import { useMutation, useQuery } from "@tanstack/react-query";
import { PriceListController, type PriceListPayload } from "@/app/price-listing/controller";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";

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
  const reduxUserId = useSelector((state: StoreRootState) => {
    const user = state?.data?.userdata?.user as
      | { _id?: string | number; id?: string | number }
      | undefined;
    return user?._id ?? user?.id;
  });
  const editData = useSelector(
    (state: StoreRootState) => state?.data?.editData?.editData,
  );
  const userId =
    reduxUserId ??
    localStorage.getItem("user_id") ??
    localStorage.getItem("userId") ??
    localStorage.getItem("userid") ??
    undefined;
  const priceListController = React.useMemo(
    () => new PriceListController(),
    [],
  );
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

  React.useEffect(() => {
    if (!editId || !editData || form.formState.isDirty) {
      return;
    }

    const proofList = String(editData?.proof_attached ?? "")
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
    const hasProof = (label: string) => proofList.includes(label);

    form.reset(
      {
        filledComplete: editData?.pan_application ? "yes" : "no",
        applicationType: editData?.pan_type ? "change" : "new",
        deliveryType: editData?.pan_delivery ? "both" : "e-pan",
        customerName: editData?.customername ?? "",
        fatherName: editData?.fathername ?? "",
        email: editData?.customeremail ?? "",
        mobileNo: editData?.mobile ?? editData?.mobno ?? "",
        dob: editData?.dob ?? "",
        aadhaarNumber: editData?.aadhaarnumber ?? "",
        agencyType: editData?.agency_type ? "NSDL" : "UTI",
        agencyTypeSecondary: editData?.agency_type ? "NSDL" : "UTI",
        proofDrivingLicense: hasProof("Driving License"),
        proofVoterCard: hasProof("Voter Card"),
        proofPassport: hasProof("Passport"),
        proofTenthCertificate: hasProof("10th Certificate"),
        proofAadhaarCard: hasProof("Aadhaar Card"),
        proofDeliverInShop:
          hasProof("Deliver In Shop") || hasProof("Deliver In Shop + ₹ 50"),
        proofAffidavitDob:
          hasProof("Affidavit for Date of Birth") ||
          hasProof("Affidavit for Date of Birth + ₹ 60"),
        proofNotaryTest:
          hasProof("Notary Test") || hasProof("Notary Test + ₹ 50"),
        proofBirthCertificate: hasProof("Birth Certificate"),
        proofNotApplicable: hasProof("Not Applicable"),
        proofGazetteNameChange:
          hasProof("Name Correction") ||
          hasProof("Name Correction ₹100") ||
          hasProof("MP/MLA/GAZETTED (IN CASE OF NAME CHANGE)"),
        proofGazetteFatherName:
          hasProof("Father's Name Correction") ||
          hasProof("Father's Name Correction ₹100") ||
          hasProof("MP/MLA/GAZETTED (IN CASE OF FATHER NAME)"),
        comments: editData?.comments ?? "",
        panApplicationFee: Number(editData?.pan_application_form_filled_fees ?? 0),
        convenienceFee: Number(editData?.convenience_fees ?? 0),
        subtotal: Number(editData?.subtotal ?? editData?.order_amount ?? 0),
        total: Number(editData?.order_amount ?? 0),
      },
      { keepDefaultValues: true },
    );
  }, [editData, editId, form]);

  const filledComplete = useWatch({ control: form.control, name: "filledComplete" });
  const deliveryType = useWatch({ control: form.control, name: "deliveryType" });
  const agencyType = useWatch({ control: form.control, name: "agencyType" });
  const panApplicationFee = useWatch({
    control: form.control,
    name: "panApplicationFee",
  });
  const convenienceFee = useWatch({
    control: form.control,
    name: "convenienceFee",
  });
  const subtotal = useWatch({ control: form.control, name: "subtotal" });
  const total = useWatch({ control: form.control, name: "total" });
  const proofDeliverInShop = useWatch({
    control: form.control,
    name: "proofDeliverInShop",
  });
  const proofAffidavitDob = useWatch({
    control: form.control,
    name: "proofAffidavitDob",
  });
  const proofNotaryTest = useWatch({
    control: form.control,
    name: "proofNotaryTest",
  });
  const proofGazetteNameChange = useWatch({
    control: form.control,
    name: "proofGazetteNameChange",
  });
  const proofGazetteFatherName = useWatch({
    control: form.control,
    name: "proofGazetteFatherName",
  });

  React.useEffect(() => {
    form.setValue("agencyTypeSecondary", agencyType || "UTI", {
      shouldValidate: true,
    });
  }, [agencyType, form]);

  const { data: priceListResponse } = useQuery({
    queryKey: ["price-listing"],
    queryFn: () => priceListController.getPriceList(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const priceList = React.useMemo(() => {
    const payload =
      (priceListResponse as { data?: Partial<PriceListPayload> })?.data ??
      (priceListResponse as Partial<PriceListPayload> | undefined);
    return payload ?? null;
  }, [priceListResponse]);

  React.useEffect(() => {
    if (!priceList) {
      return;
    }

    const toNumber = (value?: number) => Number(value ?? 0);
    const toPrice = (value: number | undefined, fallback: number) => {
      const numeric = Number(value ?? 0);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
    };

    const panBaseFee = toNumber(priceList.pnamount);
    const filledFee =
      filledComplete === "yes" ? toNumber(priceList.filledcomplete) : 0;
    const agencyFee =
      agencyType === "NSDL" ? toNumber(priceList.agency_type_nsdl) : 0;
    const deliveryFee =
      deliveryType === "both" ? toNumber(priceList.deliveryfees) : 0;
    const deliverInShopFee = proofDeliverInShop
      ? toPrice(priceList.deliverinshop, 50)
      : 0;
    const affidavitFee = proofAffidavitDob
      ? toPrice(priceList.affidavitproffatached, 60)
      : 0;
    const notaryFee = proofNotaryTest
      ? toPrice(priceList.notaryproffatached, 50)
      : 0;
    const gazetteNameFee = proofGazetteNameChange
      ? toPrice(priceList.mpmla, 100)
      : 0;
    const gazetteFatherFee = proofGazetteFatherName
      ? toPrice(priceList.mpmla, 100)
      : 0;

    const basePanFee =
      panBaseFee + filledFee + agencyFee + deliveryFee;
    const convenienceFeeValue = toNumber(priceList.convfees);
    const subtotalValue = basePanFee + convenienceFeeValue;
    const extrasTotal =
      deliverInShopFee +
      affidavitFee +
      notaryFee +
      gazetteNameFee +
      gazetteFatherFee;
    const totalValue = subtotalValue + extrasTotal;

    form.setValue("panApplicationFee", basePanFee, { shouldValidate: true });
    form.setValue("convenienceFee", convenienceFeeValue, { shouldValidate: true });
    form.setValue("subtotal", subtotalValue, { shouldValidate: true });
    form.setValue("total", totalValue, { shouldValidate: true });
  }, [
    agencyType,
    deliveryType,
    filledComplete,
    form,
    priceList,
    proofAffidavitDob,
    proofDeliverInShop,
    proofGazetteFatherName,
    proofGazetteNameChange,
    proofNotaryTest,
  ]);

  const summaryRows = React.useMemo(() => {
    const toNumber = (value?: number) => Number(value ?? 0);
    const safeNumber = (value?: number) =>
      Number.isFinite(Number(value)) ? Number(value) : 0;
    const toPrice = (value: number | undefined, fallback: number) => {
      const numeric = Number(value ?? 0);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
    };

    const affidavitFee = proofAffidavitDob
      ? toPrice(priceList?.affidavitproffatached, 60)
      : 0;
    const notaryFee = proofNotaryTest
      ? toPrice(priceList?.notaryproffatached, 50)
      : 0;
    const deliverInShopFee = proofDeliverInShop
      ? toPrice(priceList?.deliverinshop, 50)
      : 0;
    const gazetteNameFee = proofGazetteNameChange
      ? toPrice(priceList?.mpmla, 100)
      : 0;
    const gazetteFatherFee = proofGazetteFatherName
      ? toPrice(priceList?.mpmla, 100)
      : 0;

    const rows = [
      { label: "PAN Application x 1", value: safeNumber(panApplicationFee) },
      { label: "Convenience fees", value: safeNumber(convenienceFee) },
      { label: "Subtotal", value: safeNumber(subtotal) },
    ];

    if (proofAffidavitDob) {
      rows.push({ label: "Affidavit Proofs Attached", value: affidavitFee });
    }
    if (proofNotaryTest) {
      rows.push({ label: "Notary Test Proofs Attached", value: notaryFee });
    }
    if (proofDeliverInShop) {
      rows.push({ label: "Deliver In Shop", value: deliverInShopFee });
    }
    if (proofGazetteNameChange) {
      rows.push({
        label: "MP/MLA/GAZETTED (Name Change)",
        value: gazetteNameFee,
      });
    }
    if (proofGazetteFatherName) {
      rows.push({
        label: "MP/MLA/GAZETTED (Father Name)",
        value: gazetteFatherFee,
      });
    }

    rows.push({ label: "Total", value: safeNumber(total) });
    return rows;
  }, [
    convenienceFee,
    panApplicationFee,
    priceList,
    proofAffidavitDob,
    proofDeliverInShop,
    proofGazetteFatherName,
    proofGazetteNameChange,
    proofNotaryTest,
    subtotal,
    total,
  ]);

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
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const getNextSerial = () => {
      try {
        const key = "pan_application_serial";
        const current = Number(localStorage.getItem(key) ?? "0");
        const next = Number.isFinite(current) && current >= 0 ? current + 1 : 1;
        localStorage.setItem(key, String(next));
        return next;
      } catch {
        return undefined;
      }
    };

    const serialNo = editId ? undefined : getNextSerial();

    const proofAttached = [
      data.proofDrivingLicense ? "Driving License" : null,
      data.proofVoterCard ? "Voter Card" : null,
      data.proofPassport ? "Passport" : null,
      data.proofTenthCertificate ? "10th Certificate" : null,
      data.proofAadhaarCard ? "Aadhaar Card" : null,
      data.proofBirthCertificate ? "Birth Certificate" : null,
      data.proofNotApplicable ? "Not Applicable" : null,
    ]
      .filter(Boolean)
      .join(",");

    const indicateChanges = new Set<string>();
    if (data.applicationType === "change") {
      ["name", "fathername", "dob"].forEach((item) =>
        indicateChanges.add(item),
      );
    }
    if (data.proofGazetteNameChange) {
      indicateChanges.add("name");
    }
    if (data.proofGazetteFatherName) {
      indicateChanges.add("fathername");
    }

    const payload = {
      id: editId ?? undefined,
      pan_application: data.filledComplete === "yes" ? 1 : 0,
      pan_type: data.applicationType === "change" ? 1 : 0,
      indicate_changes: indicateChanges.size
        ? Array.from(indicateChanges).join(",")
        : undefined,
      customername: data.customerName,
      fathername: data.fatherName,
      customeremail: data.email,
      mobile: data.mobileNo,
      dob: data.dob,
      oldpan: "",
      user_id: userId ?? undefined,
      serial_no: serialNo,
      agency_type: data.agencyType === "NSDL" ? 1 : 0,
      proof_attached: proofAttached || undefined,
      aadhaarnumber: data.aadhaarNumber,
      uploadfile_aadhar_front: "dummy",
      uploadfile: "",
      uploadfile_aadhar_back: "dummy",
      uploadfile_pancard: "",
      uploadfile_signature: "",
      uploadfile_other_document: "",
      uploadfile_other_proof: "",
      comments: data.comments ?? "",
      order_amount: String(data.total ?? ""),
      pan_delivery: data.deliveryType === "both" ? 1 : 0,
      convenience_fees: String(data.convenienceFee ?? ""),
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
                  {summaryRows.map((row, index) => (
                    <div
                      key={`${row.label}-${index}`}
                      className="grid grid-cols-2 border-b px-4 py-3 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <input type="hidden" {...form.register("panApplicationFee")} />
                <input type="hidden" {...form.register("convenienceFee")} />
                <input type="hidden" {...form.register("subtotal")} />
                <input type="hidden" {...form.register("total")} />
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

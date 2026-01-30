"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import CustomField from "@/components/reusableComponents/customField";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Form } from "@/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Link } from "react-router-dom";
import { StoreRootState } from "@/reduxstore/redux-store";
import { setPriceList } from "@/reduxstore/priceListSlice";
import { PriceListController, type PriceListPayload } from "./controller";
import { IndianRupee, Pencil } from "lucide-react";

const numberField = z
  .coerce.number({
    required_error: "Value is required",
    invalid_type_error: "Value must be a number",
  })
  .finite("Value must be a valid number")
  .min(0, "Value must be 0 or more");

const schema = z.object({
  pan_application_form_filled_fees: numberField,
  pan_application_fees: numberField,
  convenience_fees: numberField,
  delivery_fees: numberField,
  agency_type_fees: numberField,
  affidavit_date_of_birth_fees: numberField,
  notary_test_fees: numberField,
  total_amount_of_pan_card: numberField,
  deliver_in_shop: numberField,
  itr_application_fees: numberField,
  e_verify_fees: numberField,
  pvc_print_fees: numberField,
  gst_fees: numberField,
  aadhaar_card_address: numberField,
  old_itr: numberField,
  mp_mla_gazetted: numberField,
  find_pan_card: numberField,
  find_aadhar_card: numberField,
});

type PriceFormValues = z.infer<typeof schema>;

const fields: { name: keyof PriceFormValues; label: string }[] = [
  { name: "pan_application_form_filled_fees", label: "PAN application form filled fees" },
  { name: "pan_application_fees", label: "PAN application fees" },
  { name: "convenience_fees", label: "Convenience fees" },
  { name: "delivery_fees", label: "Delivery fees" },
  { name: "agency_type_fees", label: "Agency type fees" },
  { name: "affidavit_date_of_birth_fees", label: "Affidavit date of birth fees" },
  { name: "notary_test_fees", label: "Notary test fees" },
  { name: "total_amount_of_pan_card", label: "Total amount of PAN card" },
  { name: "deliver_in_shop", label: "Deliver in shop" },
  { name: "itr_application_fees", label: "ITR application fees" },
  { name: "e_verify_fees", label: "E-verify fees" },
  { name: "pvc_print_fees", label: "PVC print fees" },
  { name: "gst_fees", label: "GST fees" },
  { name: "aadhaar_card_address", label: "Aadhaar card address" },
  { name: "old_itr", label: "Old ITR" },
  { name: "mp_mla_gazetted", label: "MP/MLA/Gazetted" },
  { name: "find_pan_card", label: "Find PAN card" },
  { name: "find_aadhar_card", label: "Find Aadhaar card" },
];

const emptyDefaults: PriceFormValues = fields.reduce(
  (acc, field) => ({ ...acc, [field.name]: 0 }),
  {} as PriceFormValues,
);

const fieldLabels: Record<keyof PriceFormValues, string> = {
  pan_application_form_filled_fees: "PAN Application Form Filled Fees",
  pan_application_fees: "PAN Application Fees",
  convenience_fees: "Convenience Fees",
  delivery_fees: "Delivery Fees",
  agency_type_fees: "Agency Type Fees",
  affidavit_date_of_birth_fees: "Affidavit Date of Birth Fees",
  notary_test_fees: "Notary Test Fees",
  total_amount_of_pan_card: "Total Amount of PAN Card",
  deliver_in_shop: "Deliver in Shop",
  itr_application_fees: "ITR Application Fees",
  e_verify_fees: "E-Verify Fees",
  pvc_print_fees: "PVC Print Fees",
  gst_fees: "GST Fees",
  aadhaar_card_address: "Aadhaar Card Address",
  old_itr: "Old ITR",
  mp_mla_gazetted: "MP/MLA/Gazetted",
  find_pan_card: "Find PAN Card",
  find_aadhar_card: "Find Aadhaar Card",
};

const mapPayloadToFormValues = (
  payload: Partial<PriceListPayload>,
): PriceFormValues => ({
  pan_application_form_filled_fees: Number(payload.filledcomplete ?? 0),
  pan_application_fees: Number(payload.pnamount ?? 0),
  convenience_fees: Number(payload.convfees ?? 0),
  delivery_fees: Number(payload.deliveryfees ?? 0),
  agency_type_fees: Number(payload.agency_type_nsdl ?? 0),
  affidavit_date_of_birth_fees: Number(payload.affidavitproffatached ?? 0),
  notary_test_fees: Number(payload.notaryproffatached ?? 0),
  total_amount_of_pan_card: Number(payload.totalamountpancard ?? 0),
  deliver_in_shop: Number(payload.deliverinshop ?? 0),
  itr_application_fees: Number(payload.itrcharge ?? 0),
  e_verify_fees: Number(payload.everify ?? 0),
  pvc_print_fees: Number(payload.pvccharge ?? 0),
  gst_fees: Number(payload.gstcharge ?? 0),
  aadhaar_card_address: Number(payload.aadharcardaddress ?? 0),
  old_itr: Number(payload.olditr ?? 0),
  mp_mla_gazetted: Number(payload.mpmla ?? 0),
  find_pan_card: Number(payload.findpancard ?? 0),
  find_aadhar_card: Number(payload.findaadharcard ?? 0),
});

function PriceListing() {
  const dispatch = useDispatch();
  const controller = useMemo(() => new PriceListController(), []);
  const existingPriceList = useSelector(
    (state: StoreRootState) => state.data.priceList.priceList
  );
  const [isEditing, setIsEditing] = useState(existingPriceList === null);

  const isEditMode = existingPriceList !== null;

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: existingPriceList ?? emptyDefaults,
  });

  const { data: priceListData } = useQuery({
    queryKey: ["price-listing"],
    queryFn: () => controller.getPriceList(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!priceListData) {
      return;
    }

    const payload =
      (priceListData as { data?: Partial<PriceListPayload> })?.data ??
      (priceListData as Partial<PriceListPayload>);

    const mapped = mapPayloadToFormValues(payload);

    if (!form.formState.isDirty) {
      form.reset(mapped);
      setIsEditing(false);
    }

    dispatch(setPriceList(mapped));
  }, [dispatch, form, priceListData]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PriceListPayload) =>
      controller.updatePriceList(payload),
    onSuccess: (_, payload) => {
      dispatch(
        setPriceList({
          pan_application_form_filled_fees: payload.filledcomplete,
          pan_application_fees: payload.pnamount,
          convenience_fees: payload.convfees,
          delivery_fees: payload.deliveryfees,
          agency_type_fees: payload.agency_type_nsdl,
          affidavit_date_of_birth_fees: payload.affidavitproffatached,
          notary_test_fees: payload.notaryproffatached,
          total_amount_of_pan_card: payload.totalamountpancard,
          deliver_in_shop: payload.deliverinshop,
          itr_application_fees: payload.itrcharge,
          e_verify_fees: payload.everify,
          pvc_print_fees: payload.pvccharge,
          gst_fees: payload.gstcharge,
          aadhaar_card_address: payload.aadharcardaddress,
          old_itr: payload.olditr,
          mp_mla_gazetted: payload.mpmla,
          find_pan_card: payload.findpancard,
          find_aadhar_card: payload.findaadharcard,
        }),
      );
      setIsEditing(false);
    },
  });

  const onSubmit = (data: PriceFormValues) => {
    const payload: PriceListPayload = {
      filledcomplete: data.pan_application_form_filled_fees,
      pnamount: data.pan_application_fees,
      convfees: data.convenience_fees,
      deliveryfees: data.delivery_fees,
      agency_type_nsdl: data.agency_type_fees,
      affidavitproffatached: data.affidavit_date_of_birth_fees,
      notaryproffatached: data.notary_test_fees,
      totalamountpancard: data.total_amount_of_pan_card,
      deliverinshop: data.deliver_in_shop,
      itrcharge: data.itr_application_fees,
      everify: data.e_verify_fees,
      pvccharge: data.pvc_print_fees,
      gstcharge: data.gst_fees,
      aadharcardaddress: data.aadhaar_card_address,
      olditr: data.old_itr,
      mpmla: data.mp_mla_gazetted,
      findpancard: data.find_pan_card,
      findaadharcard: data.find_aadhar_card,
    };
    mutate(payload);
  };

  const priceData = existingPriceList
    ? (Object.keys(fieldLabels) as (keyof PriceFormValues)[]).map((key) => ({
        label: fieldLabels[key],
        value: existingPriceList[key],
      }))
    : [];

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
                <Link to="/price-listing">Price Listing</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Price Listing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage service fees and update pricing in one place.
            </p>
          </div>
          {existingPriceList && !isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Prices
            </Button>
          ) : null}
        </div>
      </div>

      {existingPriceList && !isEditing ? (
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {priceData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="flex items-center font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            <FormProvider {...form}>
              <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {fields.map(({ name, label }) => (
                      <CustomField
                        key={name}
                        name={name}
                        label={label}
                        placeholder="0"
                        type="number"
                        isLoading={false}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    {existingPriceList ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form.reset(existingPriceList);
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                    )}
                    <Button type="submit" variant="destructive" disabled={isPending}>
                      {isPending
                        ? "Saving..."
                        : isEditMode
                          ? "Update Prices"
                          : "Save Prices"}
                    </Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PriceListing;

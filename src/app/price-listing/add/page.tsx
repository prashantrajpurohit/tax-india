"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import CustomField from "@/components/reusableComponents/customField";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Form } from "@/ui/form";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const numberField = z.coerce.number().min(0, "Value is required").finite();

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

function Page() {
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: 0 }),
      {} as Record<keyof PriceFormValues, number>,
    ),
  });

  const onSubmit = (data: PriceFormValues) => {
    console.log("Price listing submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Add Price Listing</h1>
        <Button asChild variant="outline">
          <Link to="/price-listing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <FormProvider {...form}>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="submit" variant="destructive">
                    Save Prices
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

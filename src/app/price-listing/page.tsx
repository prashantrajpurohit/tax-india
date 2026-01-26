"use client";

import { useSelector } from "react-redux";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Link } from "react-router-dom";
import { IndianRupee, Pencil, Plus } from "lucide-react";
import { StoreRootState } from "@/reduxstore/redux-store";
import { PriceListData } from "@/reduxstore/priceListSlice";

const fieldLabels: Record<keyof PriceListData, string> = {
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

function Page() {
  const priceList = useSelector(
    (state: StoreRootState) => state.data.priceList.priceList
  );

  const hasPrices = priceList !== null;

  const priceData = priceList
    ? (Object.keys(fieldLabels) as (keyof PriceListData)[]).map((key) => ({
        label: fieldLabels[key],
        value: priceList[key],
      }))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Price Listing</h1>
        {hasPrices ? (
          <Button asChild>
            <Link to="/price-listing/add">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Prices
            </Link>
          </Button>
        ) : (
          <Button asChild variant="destructive">
            <Link to="/price-listing/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Price Listing
            </Link>
          </Button>
        )}
      </div>

      {hasPrices ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Price Configuration</CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No price configuration found. Click "Add Price Listing" to configure prices.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Page;

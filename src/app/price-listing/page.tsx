import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Link } from "react-router-dom";
import { IndianRupee, Pencil, Plus } from "lucide-react";

// Dummy data matching the form fields (null means no prices configured yet)
const priceData: { label: string; value: number }[] | null = [
  { label: "PAN Application Form Filled Fees", value: 50 },
  { label: "PAN Application Fees", value: 107 },
  { label: "Convenience Fees", value: 25 },
  { label: "Delivery Fees", value: 50 },
  { label: "Agency Type Fees", value: 30 },
  { label: "Affidavit Date of Birth Fees", value: 100 },
  { label: "Notary Test Fees", value: 75 },
  { label: "Total Amount of PAN Card", value: 437 },
  { label: "Deliver in Shop", value: 0 },
  { label: "ITR Application Fees", value: 500 },
  { label: "E-Verify Fees", value: 100 },
  { label: "PVC Print Fees", value: 150 },
  { label: "GST Fees", value: 1500 },
  { label: "Aadhaar Card Address", value: 50 },
  { label: "Old ITR", value: 750 },
  { label: "MP/MLA/Gazetted", value: 200 },
  { label: "Find PAN Card", value: 25 },
  { label: "Find Aadhaar Card", value: 25 },
];

const hasPrices = priceData && priceData.length > 0;

function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Price Listing</h1>
        {hasPrices ? (
          <Button asChild>
            <Link to="/price-listing/edit">
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

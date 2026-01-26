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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  shop_name: z.string().min(1, "Shop name is required"),
  mobile_no: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  status: z.string().min(1, "Status is required"),
});

type StaffFormValues = z.infer<typeof schema>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function Page() {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shop_name: "",
      mobile_no: "",
      address: "",
      status: "",
    },
  });

  const onSubmit = (data: StaffFormValues) => {
    console.log("Staff data submitted", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Add Staff</h1>
        <Button asChild variant="outline">
          <Link to="/staff">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CustomField
                    name="name"
                    label="Name"
                    placeholder="Enter name"
                    isLoading={false}
                  />
                  <CustomField
                    name="shop_name"
                    label="Shop Name"
                    placeholder="Enter shop name"
                    isLoading={false}
                  />
                  <CustomField
                    name="mobile_no"
                    label="Mobile No."
                    placeholder="Enter mobile number"
                    isLoading={false}
                    type="tel"
                  />
                  <CustomField
                    name="address"
                    label="Address"
                    placeholder="Enter address"
                    isLoading={false}
                  />
                  <CustomField
                    name="status"
                    label="Status"
                    placeholder="Select status"
                    isLoading={false}
                    select
                    options={statusOptions}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="submit" variant="destructive">
                    Save Staff
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

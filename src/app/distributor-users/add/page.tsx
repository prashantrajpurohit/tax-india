"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import CustomField from "@/components/reusableComponents/customField";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Link } from "react-router-dom";

const schema = z.object({
  distributor_name: z.string().min(1, "Distributor name is required"),
  shop_name: z.string().min(1, "Shop name is required"),
  mobile_no: z.string().min(1, "Mobile number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.string().min(1, "Status is required"),
});

type DistributorFormValues = z.infer<typeof schema>;

const statusOptions = ["Approved", "Pending"];

const Page = () => {
  const form = useForm<DistributorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      distributor_name: "",
      shop_name: "",
      mobile_no: "",
      address: "",
      status: "Approved",
    },
  });

  const onSubmit = (data: DistributorFormValues) => {
    console.log("Distributor user submitted", data);
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
                <Link to="/distributor-users">Distributor Users</Link>
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
            <h1 className="text-2xl font-semibold">Add Distributor User</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add distributor details and set the account status.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomField
                  name="distributor_name"
                  isLoading={false}
                  placeholder="Enter distributor name"
                  label="Distributor Name"
                />
                <CustomField
                  name="shop_name"
                  isLoading={false}
                  placeholder="Enter shop name"
                  label="Shop Name"
                />
                <CustomField
                  name="mobile_no"
                  isLoading={false}
                  placeholder="Enter mobile number"
                  label="Mobile Number"
                />
                <CustomField
                  name="status"
                  isLoading={false}
                  placeholder="Select status"
                  label="Status"
                  select
                  options={statusOptions}
                />
                <div className="md:col-span-2">
                  <CustomField
                    name="address"
                    isLoading={false}
                    placeholder="Enter address"
                    label="Address"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="destructive">
                  Save Distributor
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

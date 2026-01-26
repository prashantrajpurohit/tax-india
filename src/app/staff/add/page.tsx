"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomField from "@/components/reusableComponents/customField";
import { Card } from "@/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
                <Link to="/staff">Staff</Link>
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
            <h1 className="text-2xl font-semibold">Staff Add Page</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add staff details and assign access information.
            </p>
          </div>
        </div>
      </div>
      <Card className="p-3">
        <FormProvider {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomField
                name=""
                isLoading={false}
                placeholder=""
                defaultValue=""
                label="Name"
              />{" "}
              <CustomField
                name=""
                isLoading={false}
                placeholder=""
                defaultValue=""
                label="Name"
              />{" "}
              <CustomField
                name=""
                isLoading={false}
                placeholder=""
                defaultValue=""
                label="Name"
              />
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

export default Page;

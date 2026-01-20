"use client";
import CustomField from "@/components/reusableComponents/customField";
import { Card } from "@/ui/card";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

function Page() {
  const form = useForm({ defaultValues: {} });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Staff Add Page</h1>
      <Card className="p-3">
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

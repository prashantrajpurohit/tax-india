"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import CustomField from "@/components/reusableComponents/customField";
import { RetailerController, type CreateRetailerPayload } from "../controller";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    shopName: z.string().optional(),
    registrationPincode: z.string().min(1, "Registration pincode is required"),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      }),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
    panNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val), {
        message: "PAN must be 10 characters (e.g. ABCDE1234F)",
      }),
    aadhaarNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{12}$/.test(val), {
        message: "Aadhaar must be exactly 12 digits",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RetailerFormValues = z.infer<typeof schema>;

function RetailerUsersAdd() {
  const navigate = useNavigate();
  const controller = useMemo(() => new RetailerController(), []);

  const form = useForm<RetailerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      shopName: "",
      registrationPincode: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      panNumber: "",
      aadhaarNumber: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateRetailerPayload) =>
      controller.createRetailer(payload),
    onSuccess: () => {
      navigate("/retailer-users");
    },
  });

  const onSubmit = (values: RetailerFormValues) => {
    mutate({
      name: values.fullName,
      shop_name: values.shopName || undefined,
      register_pin: values.registrationPincode,
      email: values.email,
      password: values.password,
      mobile: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      pan_no: values.panNumber || undefined,
      aadhar_no: values.aadhaarNumber || undefined,
      role: "retailer",
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
                <Link to="/retailer-users">Retailer Users</Link>
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
            <h1 className="text-2xl font-semibold text-slate-900">
              Add Retailer
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a retailer account with login credentials.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/retailer-users">Back to list</Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Retailer details</CardTitle>
          <CardDescription>
            Fill in the retailer's basic information and login access.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <CustomField
                    name="fullName"
                    label="Full Name *"
                    placeholder="Enter full name"
                    isLoading={false}
                  />
                </div>
                <CustomField
                  name="shopName"
                  label="Shop Name"
                  placeholder="Enter shop name"
                  isLoading={false}
                />
                <CustomField
                  name="registrationPincode"
                  label="Registration Pincode *"
                  placeholder="Enter registration pincode"
                  isLoading={false}
                />
                <CustomField
                  name="email"
                  label="Email *"
                  placeholder="Enter email address"
                  isLoading={false}
                  type="email"
                />
                <CustomField
                  name="phone"
                  label="Phone *"
                  placeholder="Enter phone number"
                  isLoading={false}
                />
                <div className="md:col-span-2">
                  <CustomField
                    name="address"
                    label="Address *"
                    placeholder="Enter address"
                    isLoading={false}
                  />
                </div>
                <CustomField
                  name="city"
                  label="City *"
                  placeholder="Enter city"
                  isLoading={false}
                />
                <CustomField
                  name="state"
                  label="State *"
                  placeholder="Enter state"
                  isLoading={false}
                />
                <CustomField
                  name="zip"
                  label="Zip *"
                  placeholder="Enter zip"
                  isLoading={false}
                />
                <CustomField
                  name="panNumber"
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  isLoading={false}
                />
                <CustomField
                  name="aadhaarNumber"
                  label="Aadhaar Number"
                  placeholder="12 digit number"
                  isLoading={false}
                />
                <CustomField
                  name="password"
                  label="Password *"
                  placeholder="Enter password"
                  isLoading={false}
                  type="password"
                />
                <CustomField
                  name="confirmPassword"
                  label="Confirm Password *"
                  placeholder="Re-enter password"
                  isLoading={false}
                  type="password"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" asChild>
                  <Link to="/retailer-users">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="min-w-[140px]"
                  disabled={isPending}
                  variant="destructive"
                >
                  {isPending ? "Saving..." : "Save Retailer"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default RetailerUsersAdd;

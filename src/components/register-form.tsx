"use client";

import { cn } from "@/config/utils/utils";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

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
      .min(8, { message: "Confirm password must be at least 8 characters long" }),
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

type RegisterFormValues = z.infer<typeof schema>;

const inputClassName =
  "h-12 rounded-full border-slate-200 bg-slate-50 px-4 focus-visible:ring-emerald-500/40";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const auth = useAuth();
  const [step, setStep] = useState(0);
  const { search } = useLocation();
  const referralId = useMemo(
    () => new URLSearchParams(search).get("referral_id") ?? "3",
    [search],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormValues>({
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

  const steps = useMemo(
    () => [
      {
        title: "Account basics",
        description: "Tell us who you are and how to reach you.",
        fields: ["fullName", "email", "phone"] as const,
      },
      {
        title: "Business details",
        description: "Share your shop and registration location.",
        fields: ["shopName", "registrationPincode", "address", "city", "state", "zip"] as const,
      },
      {
        title: "Verification",
        description: "Secure your account and add identifiers.",
        fields: ["password", "confirmPassword", "panNumber", "aadhaarNumber"] as const,
      },
    ],
    [],
  );

  const totalSteps = steps.length;
  const isLastStep = step === totalSteps - 1;

  const handleNext = async () => {
    const currentFields = steps[step]?.fields ?? [];
    const isValid = await trigger([...currentFields]);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: RegisterFormValues) => {
    auth.register({
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: "retailer",
      mobile: data.phone,
      address: data.address,
      state: data.state,
      city: data.city,
      pan_no: data.panNumber || undefined,
      aadhar_no: data.aadhaarNumber || undefined,
      register_pin: data.registrationPincode,
      referral_id: referralId,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="@container/card border-0 shadow-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Step {step + 1} of {totalSteps} · {steps[step]?.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{steps[step]?.title}</span>
                <span>
                  {step + 1}/{totalSteps}
                </span>
              </div>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <span
                    key={`step-${index}`}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      index <= step ? "bg-emerald-500" : "bg-slate-200",
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                {steps[step]?.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {step === 0 && (
                <>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className={inputClassName}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className={inputClassName}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      className={inputClassName}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      placeholder="Enter shop name"
                      className={inputClassName}
                      {...register("shopName")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registrationPincode">
                      Registration Pincode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="registrationPincode"
                      placeholder="Enter registration pincode"
                      className={inputClassName}
                      {...register("registrationPincode")}
                    />
                    {errors.registrationPincode && (
                      <p className="text-sm text-red-500">
                        {errors.registrationPincode.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="address">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter address"
                      className={inputClassName}
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      className={inputClassName}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      className={inputClassName}
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="zip">
                      Zip <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zip"
                      placeholder="Enter zip code"
                      className={inputClassName}
                      {...register("zip")}
                    />
                    {errors.zip && (
                      <p className="text-sm text-red-500">
                        {errors.zip.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      className={inputClassName}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className={inputClassName}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="panNumber">Pan Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="Enter PAN number"
                      className={inputClassName}
                      maxLength={10}
                      {...register("panNumber")}
                    />
                    {errors.panNumber && (
                      <p className="text-sm text-red-500">
                        {errors.panNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="aadhaarNumber">Adhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      placeholder="Enter Aadhaar number"
                      className={inputClassName}
                      maxLength={12}
                      {...register("aadhaarNumber")}
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-sm text-red-500">
                        {errors.aadhaarNumber.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-600"
                onClick={handleBack}
                disabled={step === 0}
              >
                Back
              </Button>
              {isLastStep ? (
                <Button
                  type="submit"
                  className="h-11 w-36 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-11 w-36 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Next
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-600">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

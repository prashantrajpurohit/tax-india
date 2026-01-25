import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z
  .string()
  .regex(phoneRegex, "Please enter a valid phone number");

const requiredString = (val: string) => z.string().min(1, `${val} is required`);
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "partner", "institute", "student"]),
});

export type LoginFormData = z.infer<typeof loginSchema>;

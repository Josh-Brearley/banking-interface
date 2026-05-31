import { z } from "zod";

const email = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email");

/** Registration enforces password strength; login only checks presence. */
const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[a-z]/, "One lowercase letter")
  .regex(/[0-9]/, "One number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

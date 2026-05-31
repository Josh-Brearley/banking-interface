import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phoneNumber: z
    .string()
    .regex(/^(\+?44|0)\d{9,10}$/, "Enter a valid UK phone number")
    .optional()
    .or(z.literal("")),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional().or(z.literal("")),
    city: z.string().min(1, "City is required"),
    postcode: z
      .string()
      .regex(
        /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
        "Enter a valid UK postcode",
      ),
    country: z.string().min(1, "Country is required"),
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

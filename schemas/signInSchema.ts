// schemas/signInSchema.ts
import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Username is required"), // <--- Ye line ERROR paida karegi
    
  password: z
    .string()
    .min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>
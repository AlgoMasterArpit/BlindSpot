// schemas/verifySchema.ts
import { z } from 'zod'

export const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits")
})

export type VerifyInput = z.infer<typeof verifySchema>
// schemas/acceptMessageSchema.ts
import { z } from 'zod'

export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
})

export type AcceptMessageInput = z.infer<typeof acceptMessageSchema>
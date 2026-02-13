import { z } from "zod"

export function validateObject<T>(schema: z.ZodSchema<T>, data: any) {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data, error: null }
  }

  return { success: false, data: null, error: result.error.format() }
}

import { z } from "zod"

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1, "Groq API Key is missing"),
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Telegram Bot Token is missing"),
  TELEGRAM_CHAT_ID: z.string().min(1, "Telegram Chat ID is missing"),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid Environment Variables:", parsed.error.format())
  throw new Error("Invalid Environment Variables. Check your .env file.")
}

export const env = parsed.data

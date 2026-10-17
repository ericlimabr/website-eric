import { z } from "zod"

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1, "Groq API Key is missing"),
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Telegram Bot Token is missing"),
  TELEGRAM_CHAT_ID: z.string().min(1, "Telegram Chat ID is missing"),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  // Envio de e-mail do formulário. Opcionais de propósito: enquanto a caixa do
  // domínio não existe o envio é guardado e avisado pelo Telegram do mesmo jeito.
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_MAIL_FROM: z.string().min(1).optional(),
  CONTACT_MAIL_TO: z.string().email().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid Environment Variables:", parsed.error.format())
  throw new Error("Invalid Environment Variables. Check your .env file.")
}

export const env = parsed.data

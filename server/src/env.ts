import { config } from 'dotenv'
import z from 'zod'

config({ path: '../.env' })

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(val => Number.parseInt(val, 10)),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
})

export const env = envSchema.parse(process.env)

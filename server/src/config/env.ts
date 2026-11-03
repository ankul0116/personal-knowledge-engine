import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().trim().startsWith("mongodb"),
  JWT_SECRET: z.string().trim().min(32),
  SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:", result.error.issues);
  process.exit(1);
}

export default result.data;
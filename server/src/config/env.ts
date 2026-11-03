import {z} from "zod"
// port 
const envSchema = z.object({
  PORT : z.coerce.number().int().positive().default(3000),
  MONGODB_URI :z.string().trim(),
  JWT_SECRET : z.string().trim().min(32),
  SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
})
const result = envSchema.safeParse({
  PORT : process.env.PORT,
  MONGODB_URI : process.env.MONGODB_URI ,
  JWT_SECRET : process.env.JWT_SECRET,
  SALT_ROUND: process.env.SALT_ROUND
})
if (!result.success) {
  console.error("Invalid environment variables:", result.error.issues);
  process.exit(1);
}
export default result.data ;

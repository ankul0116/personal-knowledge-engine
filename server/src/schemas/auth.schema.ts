import {z} from "zod"
export const registerSchema =z.object({
  name : z.string().trim().min(3).max(50),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  //.pipe() passes the cleaned-up string into the email check
  password : z.string().min(8).max(72)
})
export const loginSchema = z.object({
  email : z.string().trim().toLowerCase().pipe(z.email()),
  password : z.string().min(1).max(72)
})
import {z} from "zod"
export const registerSchema =z.object({
  name : z.string().trim().min(3).max(50),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  //.pipe() passes the cleaned-up string into the email check
  password : z.string().min(8).max(72)
})
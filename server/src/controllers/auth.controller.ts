
import {mongo} from "mongoose"
import bcrypt from "bcrypt"
import User from "../models/user.ts"
import env from "../config/env.ts";
const SALT_ROUND =env.SALT_ROUNDS;
import {registerSchema} from "../schemas/auth.schema.ts" 
import type { Request, Response } from "express"
export const register = async (req: Request, res: Response) => {
 
  const data = req.body;
   // 1. validate req.body with registerSchema.safeParse
  const result = registerSchema.safeParse(data);
  if(!result.success){
    return res.status(400).json({ error: { 
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      error : result.error.issues } });

  }
  // 2. hash the password
  const passwordHash = await bcrypt.hash(result.data.password,SALT_ROUND);
  // 3. User.create(...)
   try {
    const user = await User.create({
      name: result.data.name,
      email: result.data.email,
      passwordHash : passwordHash,
    });

    return res.status(201).json({
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      return res.status(409).json({
        error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" },
      });
    }
    throw error;
  }
};



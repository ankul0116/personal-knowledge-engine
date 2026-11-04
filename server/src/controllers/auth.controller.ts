import type { Request, Response } from "express";
import { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";
import env from "../config/env.ts";
import { registerSchema, loginSchema } from "../schemas/auth.schema.ts";

const TOKEN_TTL_DAYS = 7;

export const register = async (req: Request, res: Response) => {
  // 1. Validate
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid input", details: result.error.issues },
    });
  }

  // 2. Hash
  const passwordHash = await bcrypt.hash(result.data.password, env.SALT_ROUNDS);

  // 3. Create + respond
  try {
    const user = await User.create({
      name: result.data.name,
      email: result.data.email,
      passwordHash,
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

export const login = async (req: Request, res: Response) => {
  // 1. Validate
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid input", details: result.error.issues },
    });
  }

  // One response for both failure cases, so they can never differ
  const invalidCredentials = {
    error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
  };

  // 2. Find the user, including the hidden hash
  const user = await User.findOne({ email: result.data.email }).select("+passwordHash");
  if (!user) {
    return res.status(401).json(invalidCredentials);
  }

  // 3. Check the password
  const match = await bcrypt.compare(result.data.password, user.passwordHash);
  if (!match) {
    return res.status(401).json(invalidCredentials);
  }

  // 4. Sign the token: only the user's id, as the standard "sub" claim
  const token = jwt.sign({ sub: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: `${TOKEN_TTL_DAYS}d`,
  });

  // 5. Put it in an httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });

  // 6. Respond with safe fields, never the token
  return res.status(200).json({
    data: { id: user._id, name: user.name, email: user.email },
  });
};
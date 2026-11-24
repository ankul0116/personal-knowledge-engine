import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.ts";

export const unauthenticated = { error: { code: "UNAUTHENTICATED", message: "You need to log in" } };

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 1. read req.cookies.token → missing? return 401

  const token = req.cookies.token;
  if(typeof token !=="string" || !token){
    return res.status(401).json(unauthenticated);
  }

  // 2. jwt.verify(token, env.JWT_SECRET) inside try/catch → throws? return 401

  let decoded;
  try{
     decoded = jwt.verify(token ,env.JWT_SECRET);
  }catch{
    return res.status(401).json(unauthenticated)
  }


  // 3. payload is a string, or has no sub? return 401
  if (typeof decoded === "string" || !decoded.sub) {
    return res.status(401).json(unauthenticated);
  }

  // 4. Attach the user ID and pass the request on
  req.userId = decoded.sub;
  next();
};

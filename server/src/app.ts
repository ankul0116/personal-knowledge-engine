import express from "express"
import authRoutes from "./routes/auth.routes.ts"

const app=express();
app.use(express.json());
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get("/api/health",(req,res)=>{
  res.json({
    "status": "ok"
  });
});
 export default  app;
import express from "express"
import authRoutes from "./routes/auth.routes.ts"
import cookieParser from "cookie-parser";

const app=express();
app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get("/api/health",(req,res)=>{
  res.json({
    "status": "ok"
  });
});
 export default  app;
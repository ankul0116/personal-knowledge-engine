import express from "express";
const app=express();
const port=3000;
app.get("/api/health",(req,res)=>{
  res.json({
    "status": "OKhello"
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
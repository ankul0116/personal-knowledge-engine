import app from "./app.ts"
import {connectDB} from "./config/db.ts"
const port = Number(process.env.PORT ?? 3000);
const uri = process.env.MONGODB_URI;
if(!uri){
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}
try {
  await  connectDB(uri);
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
}


app.listen(port, () => {
  console.log(`server is running on port ${port}` );
  
});
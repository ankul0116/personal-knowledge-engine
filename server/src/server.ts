import app from "./app.ts";
import env from "./config/env.ts";
import { connectDB } from "./config/db.ts";

// 1. Connect to the database 
try {
  await connectDB(env.MONGODB_URI);
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
}

// 2. start accepting requests
const server = app.listen(env.PORT, () => {
  console.log(`server is running on port ${env.PORT}`);
});

// 3. If the port can't be used
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${env.PORT} is already in use. Change PORT in .env or stop the other process.`);
  } else {
    console.error("Server failed to start:", error);
  }
  process.exit(1);
});
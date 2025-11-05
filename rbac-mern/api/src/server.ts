import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

const PORT = parseInt(process.env.PORT || "4000", 10);
const MONGO_URI = process.env.MONGO_URI!;

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error("Startup failed", e);
  process.exit(1);
});

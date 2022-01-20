import { connect } from "mongoose";

export function connectToDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.log("Environment variable MONGO_URI is not found");
      process.exit();
    }

    connect(process.env.MONGO_URI);

    console.log("Connected to DB...");
  } catch (error) {
    console.log("Failed to connect to DB...", error);
    process.exit();
  }
}

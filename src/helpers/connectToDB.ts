import { connect } from "mongoose";

export function connectToDB(mongoURI: string) {
  try {
    console.log(mongoURI);
    connect(mongoURI).then(() => {
      console.log("Connected to DB...");
    });
  } catch (error) {
    console.error("Failed to connect to DB...", error);
    process.exit();
  }
}

import { log } from "console";
import mongoose from "mongoose";
// import { MONGO_DB_URL } from "./constants";
const DEFAULT_MONGO_DB_URL = "mongodb://localhost:27017/mydatabase";

const connectDb = async () => {
  try {//mongodb+srv://rhl:<db_password>@cluster0.n1ljfvk.mongodb.net/
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2249909420.
    log("coonnection db MONGO_DB_URL ",process.env.MONGO_DB_URL)
    if (!process.env.MONGO_DB_URL) {
      throw new Error("MONGO_DB_URL environment variable is not set.");
  }
    return await mongoose.connect(process.env.MONGO_DB_URL ||DEFAULT_MONGO_DB_URL, {
      // useNewUrlParser: true,  // useNewUrlParser is deprecated
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log("coonnection db db connected");

  } catch (err: any) {
    console.log("coonnection error. ",err);
    if (err.name === 'MongooseServerSelectionError') {
      console.log("MongooseServerSelectionError --- ",err.reason.servers);
    }
  }
};
export default connectDb;

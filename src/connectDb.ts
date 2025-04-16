import mongoose from "mongoose";
import { MONGO_DB_URL } from "./constants";

const connectDb = async () => {
  try {//mongodb+srv://rhl:<db_password>@cluster0.n1ljfvk.mongodb.net/
    return await mongoose.connect(MONGO_DB_URL, {
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

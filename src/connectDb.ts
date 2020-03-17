import mongoose from "mongoose";
import { MONGO_DB_URL } from "./constants";

const connectDb = async () => {
  return await mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
export default connectDb;

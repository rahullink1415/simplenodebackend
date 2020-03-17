import mongoose, { Schema } from "mongoose";
const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: [true, "Name need to be there."] },
  email: {
    type: String,
    required: [true, "Email need to be there."],
    unique: [true, "Email need to be unique."]
  },
  password: { type: String, required: [true, "Password need to be there."] }
});
export default mongoose.model("user", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: [true, "role is required"],
  },
  authenticated: {
    type: Boolean,
    default: false,
  },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  authToken: { type: String },
  authTokenExpires: { type: Date },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

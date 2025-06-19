// lib/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

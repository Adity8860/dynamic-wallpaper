// app/api/auth/login/route.js
import { connectDB } from "@/lib/db.js";
import { User } from "@/lib/models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return new Response(JSON.stringify({ token }), { status: 200 });
}

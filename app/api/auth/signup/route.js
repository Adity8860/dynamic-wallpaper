// app/api/auth/signup/route.js
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/users.js"; // <-- correct import
import bcrypt from "bcrypt";

export async function POST(req) {
  const { firstName, lastName, email, password } = await req.json();
  await connectDB();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return new Response(JSON.stringify({ message: "Signup successful" }), {
    status: 201,
  });
}

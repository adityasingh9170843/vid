import dbConnect from "@/lib/DBconnect";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({ email, password });
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

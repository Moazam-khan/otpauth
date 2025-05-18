import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SendOtpEmailOptions, SignupRequestBody } from "@/types/global"; // adjust path if needed
import { sendOtpEmail } from "@/helper/sendotp";   // adjust path if needed



const prisma = new PrismaClient();

export default async function POST(req: Request) {
  try {
    const { email, password }: SignupRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP and expiration (10 minutes)
    // Generate 6-digit OTP and expiration (10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const otpOptions: SendOtpEmailOptions = { to: email, otp };
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Update password and OTP for existing user
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp,
          otpExpiresAt,
          Isverified: false,
        },
      });

      // Send OTP email
await sendOtpEmail(otpOptions);

      return NextResponse.json({
        message: "User already exists. OTP and password updated.",
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          otp,
          otpExpiresAt,
          Isverified: false,
        },
      });

      // Send OTP email
await sendOtpEmail(otpOptions);


      return NextResponse.json({
        message: "User registered successfully. OTP sent to email.",
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

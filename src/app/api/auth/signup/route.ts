import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignupRequestBody } from "@/types/global"; // adjust path if needed
import { sendOtpEmail } from "@/helper/sendotp"; // adjust path if needed

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password }: SignupRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate and send OTP, get the OTP value back
    const otp = await sendOtpEmail(email);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp,
          otpExpiresAt,
          Isverified: false,
        },
      });

      return NextResponse.json({
        message: "User already exists. OTP and password updated.",
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          otp,
          otpExpiresAt,
          Isverified: false,
        },
      });

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

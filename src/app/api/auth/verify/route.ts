import { NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";
import { VerifyOtpRequest } from '@/types/global';

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const { email, otp }: VerifyOtpRequest = await request.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    // Look up the user by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid email or OTP' }, { status: 400 })
    }

    // Check if the OTP has expired
    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    // OTP is valid: update user record
    await prisma.user.update({
      where: { email },
      data: {
        Isverified: true,
        otp: null,
        otpExpiresAt: null
      }
    })

    // Return success response
    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 })
  } catch (error) {
    // Handle JSON parse errors or other unexpected issues
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

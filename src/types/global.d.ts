import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// ===========================
// 📧 Email OTP Function Type
// ===========================
export interface SendOtpEmailOptions {
  to: string;
  otp: string;


 
}

// ===========================
// 📝 Signup Request Body
// ===========================
export interface SignupRequestBody {
  email: string;
  password: string;
}


interface VerifyOtpRequest {
  email: string;
  otp: string;
}
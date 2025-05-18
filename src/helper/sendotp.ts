import nodemailer from "nodemailer";
import { SendOtpEmailOptions } from "@/types/global";

export async function sendOtpEmail({ to, otp }: SendOtpEmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

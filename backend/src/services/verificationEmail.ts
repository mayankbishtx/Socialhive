import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendOTP(email: string, otp: string) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Verify your account",
        text: `Your OTP is ${otp}. Please do not share it with anyone`,
    })
}
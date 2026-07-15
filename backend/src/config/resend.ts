import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function notifyNotifySignup(user: any) {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.ADMIN_EMAIL!,
        subject: "🎉 New User Signup",
        html: `
            <h2>New User Registered</h2>
            <p>Name: ${user.name}</p>
            <p>Username: ${user.username}</p>
            <p>Email: ${user.email}</p>
        `
    })
}
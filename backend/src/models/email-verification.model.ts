import mongoose, { Document, Schema } from "mongoose";

export interface IVerification extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    otp: number;
    expiresAt: Date;
}

const verificationSchema = new Schema<IVerification>({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    otp: {
        type: Number,
        required: [true, "OTP is required"],
    },
    expiresAt: {
        type: Date,
    },
        
})

const Verification = mongoose.model<IVerification>("Verification", verificationSchema);

export default Verification;
import type { Request, Response } from "express";
import bcrypt from "bcryptjs"
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/generateToken";
import type { AuthRequest } from "../types";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import redis from "../config/redis";

export const register = async (req: Request, res: Response) => {
    try {
        const { name,username,  email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = hashedToken;
        user.verificationTokenExpiry = expiry;
        await user.save();

        const VerifyUrl = `http://localhost:3000/api/auth/verify-email/${rawToken}`;

        await sendEmail(
            user.email,
            "Verify your email",
            `<h2>Welcome</h2><p>Click below to verify your email:</p>
            <a href="${VerifyUrl}">Verify Email</a>`
        )

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        const matchingPassword = await bcrypt.compare(password, user.password);

        if (!matchingPassword) {
            res.status(401).send({ message: "Invalid Credentials" });
            return;
        }

        const accessToken = generateAccessToken({ id: user._id.toString() });
        const refreshToken = generateRefreshToken({ id: user._id.toString() });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login Successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        })

        res.status(200).json({ message: "Logout successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            res.status(401).json({ message: "No refresh token provided" })
            return;
        }

        const decoded = verifyRefreshToken(token);

        const newAccessToken = generateAccessToken({ id: decoded.id });

        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const newAccessToken = generateAccessToken({ id: user._id.toString() });

        res.cookie("accesstoken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await redis.del(`feed:${user._id}`);

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.params.token as string;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: { $gt: new Date() }
        }).select("+verificationToken +verificationTokenExpiry")

        if (!user) {
            res.status(400).json({ message: "Inavalid or Expired verification link" });
            return;
        }

        user.isverified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });


    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}
import type { Request, Response } from "express";
import bcrypt from "bcryptjs"
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/generateToken";
import type { AuthRequest } from "../types";
import redis from "../config/redis";
import logger from "../config/logger";
import notifyNotifySignup from "../config/resend";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(400).json({ message: "Username already exist" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        await notifyNotifySignup(user);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        logger.error(error);
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

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
             sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login Successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        logger.error(error);
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
        logger.error(error);
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

        const user = await User.findById(decoded.id).select("name username email avatar");

        if (!user) {
            res.status(401).json({ message: "User not found" })
            return;
        }

        const newAccessToken = generateAccessToken({ id: user._id.toString() });

        res.status(200).json({ 
            accessToken: newAccessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
         });

    } catch (error) {
        logger.error(error);
        res.status(401).json({ message: "Invalid or expired refresh token" });
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

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("accesstoken", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
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
        logger.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
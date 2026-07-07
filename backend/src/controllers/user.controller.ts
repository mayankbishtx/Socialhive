import type { Response } from "express"
import type { AuthRequest } from "../types"
import User from "../models/user.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";
import { emitToUser } from "../socket";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import redis from "../config/redis";
import { generateAccessToken } from "../utils/generateToken";
import logger from "../config/logger";

export const followUser = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        const { username } = req.params;

        const targetUser = await User.findOne({ username });

        if (!targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const targetUserId = targetUser._id.toString();

        if (currentUserId === targetUserId) {
            res.status(400).json({ message: "You cannot follow yourself" });
            return;
        }

        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUser._id } });
        await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });

        await Notification.create({
            recipient: targetUser._id,
            sender: currentUserId,
            type: "follow"
        });

        emitToUser(targetUserId, "notification", {
            type: "follow",
            sender: currentUserId,
            message: "Someone started follwing you"
        });

        await redis.del(`feed:${currentUserId}`);

        res.status(200).json({ message: "User followed successfully" });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const unfollowUser = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        const { username } = req.params;

        const targetUser = await User.findOne({ username });

        if (!targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const targetUserId = targetUser._id.toString();

        if (currentUserId === targetUserId) {
            res.status(400).json({ message: "You cannot  not allowed" });
            return;
        }

        await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUser._id } });
        await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

        await redis.del(`feed:${currentUserId}`);

        res.status(200).json({ message: "User unfollowed successfully" });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user?.id;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isFollowing = currentUserId ? user.followers.some(followerId => followerId.toString() === currentUserId) : false;

        res.status(200).json({
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatar: user.avatar,
            followers: user.followers.length,
            following: user.following.length,
            createdAt: user.createdAt,
            isFollowing
        });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            res.status(404).json({ message: "You are not logged in " })
        }

        const { name, bio, avatar } = req.body;

        let avatarUrl: string | undefined;

        if (req.file) {
            avatarUrl = await uploadToCloudinary(req.file.buffer, "avatars") as string;
        }

        const updatedData: any = { name, bio, avatar };

        if (avatarUrl) {
            updatedData.avatar = avatarUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUserId,
            updatedData,
            { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const newAccessToken = generateAccessToken({ id: updatedUser._id.toString() });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await redis.del(`feed:${currentUserId}`);

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
            },
            accessToken: newAccessToken
        });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const searchUsers = async (req: AuthRequest, res: Response) => {
    try {
        const query = req.query.q as string;
        const currentUserId = req.user?.id;

        if (!query || !query.trim()) {
            res.status(400).json({ message: "Search query is required" });
            return;
        }

        const users = await User.find({
            _id: { $ne: currentUserId },
            username: { $regex: query, $options: "i" }
        }).select("name username avatar").limit(10);

        res.status(200).json({ users });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
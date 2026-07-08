import { Response } from "express";
import { AuthRequest } from "../types";
import Post from "../models/post.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";
import { emitToUser } from "../socket";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import redis from "../config/redis";
import logger from "../config/logger";
import { invalidateUserAndFollowerFeeds } from "../utils/invalidateFeedCache";

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        const { content } = req.body;

        console.log("content:", content);
console.log("file:", !!req.file);

        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        if (!content?.trim() && !req.file) {
            res.status(400).json({ message: "Post must contain image or content" });
        }

        let imageUrl: string | undefined;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "posts") as string;
        }

        const post = await Post.create({
            author: currentUserId,
            content: content?.trim() || "",
            image: imageUrl || ""
        });

        await post.populate("author", "avatar name");

        await invalidateUserAndFollowerFeeds(currentUserId);

        res.status(201).json({
            message: "Post create successfully",
            post
        })

    } catch (error) {
        logger.error(error);
        console.error("CREATE POST ERROR:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getFeed = async (req: AuthRequest, res: Response) => {
    try {
        const startTime = Date.now();

        const currentUserId = req.user?.id;

        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const cachekey = `feed:${currentUserId}`;
        const cachedFeed = await redis.get(cachekey);

        if (cachedFeed) {
            logger.info(`Feed served from CACHE in ${Date.now() - startTime}ms`);
            res.status(200).json({ posts: JSON.parse(cachedFeed) });
            return;
        }

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const followingIds = currentUser.following;
        const authorIds = [...followingIds, currentUserId];

        const posts = await Post.find({ author: { $in: authorIds } })
            .sort({ createdAt: -1 })
            .populate("author", "name username avatar")

        await redis.set(cachekey, JSON.stringify(posts), "EX", 60);

        res.status(200).json({ posts });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getUserPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const posts = await Post.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate("author", "name username avatar")

        res.status(200).json({ posts });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const postId = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Invalid Post ID" });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.author.toString() !== currentUserId) {
            res.status(403).json({ message: "Not authorized" })
            return;
        }

        await post.deleteOne();

        await invalidateUserAndFollowerFeeds(currentUserId);

        res.status(200).json({ message: "Post deleted successfully" });


    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const likePost = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const postId = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Invalid Post ID" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        await Post.findByIdAndUpdate(postId, { $addToSet: { likes: currentUserId } });

        if (post.author.toString() !== currentUserId) {
            await Notification.create({
                recipient: post.author,
                sender: currentUserId,
                type: "like",
                post: postId
            });

            emitToUser(post.author.toString(), "notification", {
                type: "like",
                sender: currentUserId,
                post: postId,
                message: "Someone liked your post"
            });
        }

        res.status(200).json({ message: "Post liked successfully" });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const unlikePost = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const postId = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Invalid Post ID" });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        await Post.findByIdAndUpdate(postId, { $pull: { likes: currentUserId } });

        res.status(200).json({ message: "Post unliked successfully" });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const postId = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Invalid Post Id" });
            return;
        }

        const { text } = req.body;
        if (!text || !text.trim()) {
            res.status(400).json({ message: "Comment text is requied" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        post.comments.push({
            user: currentUserId,
            text,
            createdAt: new Date()
        } as any);

        await post.save();

        if (post.author.toString() !== currentUserId) {
            await Notification.create({
                recipient: post.author,
                sender: currentUserId,
                type: "comment",
                post: postId
            });

            emitToUser(post.author.toString(), "notification", {
                type: "comment",
                sender: currentUserId,
                post: postId,
                message: "Someone commented on your post"
            });
        }

        res.status(201).json({ message: "Comment added successfully", comments: post.comments });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const { id, commentId } = req.params;
        const postId = id as string;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Invalid Post ID" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const comment = post.comments.find(c => c._id?.toString() === commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        if (comment.user.toString() !== currentUserId) {
            res.status(403).json({ message: "Not Authorized" });
            return;
        }

        post.comments = post.comments.filter(c => c._id?.toString() !== commentId) as any;

        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });


    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
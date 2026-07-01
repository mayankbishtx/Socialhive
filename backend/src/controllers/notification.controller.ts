import { Response } from "express";
import { AuthRequest } from "../types";
import Notification from "../models/notification.model";
import mongoose from "mongoose";

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const notifications = (
            await Notification.find({ recipient: currentUserId })
            .sort({ createdAt: -1 })
            .populate("sender", "name avatar")
            .populate("post", "content image")
        ).filter(n => n.sender);   

        res.status(200).json({ notifications });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const notificationId = req.params.id as string;
        if(!mongoose.Types.ObjectId.isValid(notificationId)) {
            res.status(400).json({ message: "Invalid notification ID" });
            return;
        }

        const notification = await Notification.findById( notificationId );   
        if(!notification) {
            res.status(404).json({ message: "Notifications not found" });
            return;
        } 

        if(notification.recipient.toString() !== currentUserId) {
            res.status(403).json({ message: "You cannot mark someone else's notifications as read" });
            return;
        }

        await Notification.findByIdAndUpdate( notificationId, { isRead: true });

        res.status(200).json({ message: "Marked as read" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        await Notification.updateMany(
            { recipient: currentUserId, isRead: false },
            { isRead: true }
        )

        res.status(200).json({ message: "All notifications are marked as read" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}   
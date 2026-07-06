import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { io } from "socket.io-client";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

interface Notification {
    _id: string;
    type: "like" | "comment" | "follow";
    sender: { name: string, avatar?: string };
    post?: { content: string };
    isRead: boolean;
    createdAt: string;
}

export default function Notifications() {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/notifications");
                setNotifications(response.data.notifications);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();

    }, [])

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            toast.success("Notification is marked as read");
        } catch (error) {
            console.log(error);
            toast.error("Failed to mark as read");
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications([]);
            toast.success("All posts are marked as read");
    
        } catch (error) {
            console.log(error);
            toast.success("Failed to mark all as read");
        }
    }

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL);

        socket.on("connect", () => {
        });

        socket.on("notification", (data) => {
            setNotifications((prev) => [
                {
                    _id: Date.now().toString(),
                    type: data.type,
                    sender: { name: data.sender },
                    isRead: false,
                    createdAt: new Date().toISOString(),
                },
                ...prev,
            ]);
        });

        return () => {
            socket.disconnect();
        }
    }, [user])

    if (loading) return <Loading />

    return (
        <div className="max-w-xl text-center lg:mt-10 mx-auto p-4 space-y-3 border-t md:border-t border-[#d3dce1] dark:border-[#303336]">

            { notifications.length > 0 ? 
            <button 
            onClick={markAllAsRead}
            className=" px-3 py-2 rounded bg-black shadow-sm text-white hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black">
                Mark All As Read
            </button> : <div className="flex justify-center items-center mt-80 text-3xl font-bold bg-linear-to-r from-black to-gray-400 dark:from-white dark:to-gray-400 bg-clip-text text-transparent "> No Notifications Found</div>}
            
            {notifications.map((n) => (
                <div
                    key={n._id}
                    onClick={(() => markAsRead(n._id))}
                    className={`p-4 rounded shadow-md cursor-pointer ${n.isRead ? "bg-white" : "bg-blue-50"}`}>
                    <p>
                        <span className="font-bold">{n.sender?.name ?? "Unknown User"}</span>{" "}
                        {n.type === "like" && "liked your post"}
                        {n.type === "comment" && "commented on your post"}
                        {n.type === "follow" && "started following you"}
                    </p>

                </div>
            ))}
        </div>
    )
};
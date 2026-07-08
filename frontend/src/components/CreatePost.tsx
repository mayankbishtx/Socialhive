import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Posts } from "../types";
import { useAuth } from "../context/useAuth";

interface CreatePostProps {
    onPostCreated: (newPost: Posts) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [posting, setPosting] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !imageFile) {
            toast.error("Post cannot be empty")
            return;
        }

        setPosting(true);

        try {
            const formData = new FormData();
            if (content) formData.append("content", content);
            if (imageFile) formData.append("image", imageFile);

            const response = await api.post("/posts", formData);

            onPostCreated(response.data.post);
            setContent("");
            setImageFile(null);
            toast.success("Post created");

        } catch(error) {
            console.log(error);
            toast.error("Failed to create post");
        } finally {
            setPosting(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="border border-[#d7dbdd] dark:border-[#303336] p-4 mb-6 space-y-3 dark:text-white">
            <div className="flex flex-row gap-3">

            <img src={user!.avatar} className="size-10 rounded-full" />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full text-lg focus:outline-none rounded resize-none"
                rows={3}
                />
                </div>

            <div className="flex items-center justify-between">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="ml-13 text-sm border rounded p-1 border-[#d3dce1] dark:border-[#303336] w-55 shadow-sm cursor-pointer"
                />

                <button
                    type="submit"
                    disabled={posting}
                    className="bg-black hover:bg-gray-800 shadow-md text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black px-3 py-1 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </form>
    )
}
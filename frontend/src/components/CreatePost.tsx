import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Posts } from "../types";

interface CreatePostProps {
    onPostCreated: (newPost: Posts) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [posting, setPosting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) {
            toast.error("Post content is required")
            return;
        }

        setPosting(true);

        try {
            const formData = new FormData();
            formData.append("content", content);
            if (imageFile) formData.append("image", imageFile);

            const response = await api.post("/posts", formData);

            onPostCreated(response.data.post);
            setContent("");
            setImageFile(null);
            toast.success("Post created");

        } catch {
            toast.error("Failed to create post");
        } finally {
            setPosting(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="border border-[#d7dbdd] dark:border-[#303336] rounded p-4 mb-6 space-y-3 dark:text-white">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border border-[#d3dce1] dark:border-[#303336] rounded p-2 resize-none"
                rows={3}
            />

            <div className="flex items-center justify-between">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="text-sm border rounded p-1 border-[#d3dce1] dark:border-[#303336] w-55 shadow-sm cursor-pointer"
                />

                <button
                    type="submit"
                    disabled={posting}
                    className="bg-blue-500 hover:bg-blue-600 shdaow-lg text-white px-3 py-1 rounded disabled:opacity-50 cursor-pointer shadow-md"
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </div>
        </form>
    )
}
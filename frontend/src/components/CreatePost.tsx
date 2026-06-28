import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

interface Post {
    _id: string;
    content: string;
    image?: string;
    author: { _id: string; name: string, avatar?: string };
    likes: string[];
    comments: { _id: string, text: string, user: string }[];
}

interface CreatePostProps {
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) {
            setError("Post content is required");
            return;
        }

        setPosting(true);
        setError("");

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
            setError("Failed to create post");
        } finally {
            setPosting(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 space-y-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border rounded p-2 resize-none shadow-sm"
                rows={3}
            />

            <div className="flex items-center justify-between">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="text-sm border rounded p-1 border-neutral-700 w-55 shadow-sm cursor-pointer"
                />

                <button
                    type="submit"
                    disabled={posting}
                    className="bg-blue-500 hover:bg-blue-600 shdaow-lg text-white px-3 py-1 rounded disabled:opacity-50 cursor-pointer shadow-md"
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </div>

            {error && <p className="text-red-500 text-small">{error}</p>}
        </form>
    )
}
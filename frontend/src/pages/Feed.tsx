import { useState } from "react"
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import Loading from "../components/Loading";
import CreatePost from "../components/CreatePost";
import timeAgo from "../utils/timeAgo";
import type { Posts } from "../types";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Feed() {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { user, authLoading } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data:posts = [], isLoading } = useQuery<Posts[]>({
        queryKey: ["feed"],
        queryFn: async () => {
            const response = await api.get("/posts/feed");
            return response.data.posts;
        },
        staleTime: 0,
        refetchOnMount: true
    })

    const handleLike = async (postId: string, isLiked: boolean) => {
        if (!user) return;
        try {
            if (isLiked) {
                await api.delete(`/posts/${postId}/unlike`);
            } else {
                await api.post(`/posts/${postId}/like`);
            }

            queryClient.setQueryData<Posts[]>(
                ["feed"],
                (prevPosts = []) =>
                prevPosts.map((post) => {
                    if (post._id !== postId) return post;

                    return {
                        ...post,
                        likes: isLiked ? post.likes.filter((id) => id !== user.id) : [...post.likes, user.id]
                    };
                })
            );

        } catch (error) {
            console.log(error);
        }
    };

    const handlePostCreated = (newPost: Posts) => {
        queryClient.setQueryData<Posts[]>(
            ["feed"],
            (prevPosts = []) => [
                newPost, ...prevPosts
            ]
        );
    };

    if (authLoading || isLoading) return <Loading />
    if (!user) return null;

    return (
        <div className="lg:mt-8 max-w-xl mx-auto p-2 space-y-4  dark:bg-black">
            <div>
                <CreatePost onPostCreated={handlePostCreated} />
                {posts.map((post) => {
                    const isLiked = post.likes.includes(user.id);
                    return (    
                        <div key={post._id} className="rounded border border-[#d3dce1] dark:border-[#303336] p-4 dark:text-white">
                            <div className="flex flex-rol items-center gap-2">
                                <img src={post.author.avatar} className="rounded-full size-10" />
                                <span className="flex flex-rol items-center gap-1">
                                    <p
                                        onClick={() => navigate(`/profile/${post.author.username}`)}
                                        className="text-sm font-bold hover:underline cursor-pointer ">
                                        {post.author.name}
                                    </p>
                                    ·<span className="text-gray-600 text-sm/6 font-medium dark:text-gray-200">
                                        {timeAgo(post.createdAt)}
                                    </span>
                                </span>
                            </div>
                            <p className="ml-12">{post.content}</p>
                            {post.image && <img src={post.image} onClick={() => setSelectedImage(post.image!)} className="mt-2 rounded-2xl border border-neutral-300 dark:border-[#303336]" />}

                            <button onClick={() => handleLike(post._id, isLiked)} className="flex items-center gap-1 mt-2">
                                <Heart size={18}
                                    className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} /> {post.likes.length}
                            </button>
                        </div>
                    );
                })}
                {selectedImage && (
                    <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                        <img src={selectedImage} className="max-w-[90%] max-h-[90%] object-contain rounded-2xl" />
                    </div>
                )}
            </div>
        </div>
    )
};
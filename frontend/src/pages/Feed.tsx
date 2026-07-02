import { useEffect, useState } from "react"
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import Loading from "../components/Loading";
import CreatePost from "../components/CreatePost";
import timeAgo from "../utils/timeAgo";
import type { Posts } from "../types";

export default function Feed() {

    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const response = await api.get("/posts/feed");
                setPosts(response.data.posts);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();

    }, [])

    const handleLike = async (postId: string, isLiked: boolean) => {
        try {
            if (isLiked) {
                await api.delete(`/posts/${postId}/unlike`);
            } else {
                await api.post(`/posts/${postId}/like`);
            }

            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post._id !== postId) return post;

                    return {
                        ...post,
                        likes: isLiked ? post.likes.filter((id) => id !== user!.id) : [...post.likes, user!.id]
                    };
                })
            );

        } catch (error) {
            console.log(error);
        }
    };

    const handlePostCreated = (newPost: Posts) => {
        setPosts((prev) => [newPost, ...prev]);
    }

    if (loading) return <Loading />

    return (
        <div className="mt-10 max-w-xl mx-auto p-2 space-y-4  dark:bg-black ">
            <div className="">

            <CreatePost onPostCreated={handlePostCreated} />
            {posts.map((post) => (
                <div key={post._id} className="border border-[#d3dce1] dark:border-[#303336] p-4 dark:text-white">
                    <p className="font-bold">{post.author.name} · <span className="text-gray-600 text-sm/6 font-medium">{timeAgo(post.createdAt)}</span></p>
                    <p>{post.content}</p>
                    {post.image && <img src={post.image} className="mt-2 rounded" />}
                    <button onClick={(() => handleLike(post._id, post.likes.includes(user!.id)))}>
                        ❤️ {post.likes.length}
                    </button>
                </div>
            ))}
            </div>
        </div>
    )
};
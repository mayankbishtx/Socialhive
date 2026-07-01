import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import timeAgo from "../utils/timeAgo";
import type { Posts } from "../types";

interface User {
    avatar?: string;
    name: string;
    username: string;
    bio: string;
    followers: number;
    following: number
}

export default function Profile() {

    const { id } = useParams();
    const [profile, setProfile] = useState<User | null>(null);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.delete(`/users/${id}/unfollow`);
                toast.success("Unfollow");
            } else {
                await api.post(`/users/${id}/follow`);
                toast.success("Follow");
            }
            setIsFollowing(!isFollowing);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profileRes = await api.get(`/users/${id}`);
                setProfile(profileRes.data);
                setIsFollowing(profileRes.data.isFollowing);

                const postsRes = await api.get(`/posts/user/${id}`)
                setPosts(postsRes.data.posts);

            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        };
        fetchProfile();

    }, [id])

    const deletePost = async (postId: string) => {
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            toast.success("Post deleted")

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading />
    if (!profile) return <div className="h-screen flex items-center justify-center text-5xl font-extrabold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent"> User not found</div>

    return (
        <div className="max-w-xl mt-10 mx-auto p-4 shadow-2xl bg-mauve-50 rounded">
            <div className="flex gap-6 items-start">
                <img src={profile.avatar || "/default-avatar.png"} className="w-28 h-28 rounded-full shadow-lg" />
                <div className="flex flex-col flex-1">
                    <h1 className="text-lg font-bold ">{profile.name}</h1>
                    <p className="text-gray-500">@{profile.username}</p>

                    <p className="text-gray-600 ">{profile.bio}</p>
                    <div className="flex gap-6 mt-3">
                        <span>{profile.followers} Followers</span>
                        <span>{profile.following} Following</span>
                    </div>

                    {user!.id === id ? (
                        <button onClick={() => navigate("/update-profile")}
                            className="px-4 py-2 rounded mt-2 bg-emerald-500 shadow-sm text-white hover:bg-emerald-600">
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className="mt-4 w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {posts.map((post) => (
                    <div key={post._id} className="border p-4 rounded">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">

                        <p className="font-bold">{post.author.name} · <span className="text-gray-600 text-sm/6 font-mediump">{timeAgo(post.createdAt)}</span></p>
                            <p>{post.content}</p>
                            </div>
                            {user!.id === id ?                             
                            <button
                                onClick={(() => deletePost(post._id))}
                                className="bg-red-500 px-2.5 py-1 rounded hover:bg-red-600 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button> : " "}

                        </div>
                        {post.image && <img src={post.image} className="mt-2 rounded" />}
                    </div>
                ))}
            </div>
        </div>
    )
};

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import timeAgo from "../utils/timeAgo";
import type { Posts } from "../types";
import { Delete } from "lucide-react";

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
    if (!profile) return <div className="h-screen flex items-center justify-center text-5xl font-extrabold bg-black dark:bg-linear-to-r dark:from-white dark:to-gray-500 bg-clip-text text-transparent"> User not found</div>

    return (
        <div className="max-w-xl mt-10 mx-auto p-4 border border-[#d3dce1] dark:border-[#303336]">
            <div className="flex gap-6 items-start">
                <img src={profile.avatar || "/default-avatar.png"} className="w-28 h-28 rounded-full shadow-lg" />
                <div className="flex flex-col flex-1">
                    <h1 className="text-lg font-bold dark:text-white">{profile.name}</h1>
                    <p className="text-gray-500 dark:text-gray-100">@{profile.username}</p>

                    <p className="text-gray-600 dark:text-white">{profile.bio}</p>
                    <div className="flex gap-6 mt-3 dark:text-white">
                        <span>{profile.followers} Followers</span>
                        <span>{profile.following} Following</span>
                    </div>

                    {user!.id === id ? (
                        <button onClick={() => navigate("/update-profile")}
                            className="px-4 py-2 rounded mt-2 cursor-pointer bg-black shadow-sm text-white hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black">
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
                    <div key={post._id} className="border-t -mx-4 border-[#ced5d9] dark:border-[#303336] p-4">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">

                        <p className="font-bold dark:text-white">{post.author.name} · <span className="text-gray-600 text-sm/6 font-mediump dark:text-gray-100">{timeAgo(post.createdAt)}</span></p>
                            <p className="dark:text-white">{post.content}</p>
                            </div>
                            {user!.id === id ?                             
                            <button
                                onClick={(() => deletePost(post._id))}
                                className="px-1 py-1 rounded cursor-pointer text-red-500 dark:text-white">
                                <Delete/>
                            </button> : " "}

                        </div>
                        {post.image && <img src={post.image} className="mt-2 rounded-2xl border border-[#dcdec1] dark:border-[#2c2c2d]" />}
                    </div>
                ))}
            </div>
        </div>
    )
};

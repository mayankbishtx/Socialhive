import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"
import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function UpdateProfile() {

    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("name", name)
            formData.append("bio", bio)
            if (avatar) formData.append("avatar", avatar);

            const res = await api.put("/users/me", formData);

            const { user: freshUserData, accessToken: newAccessToken } = res.data;

            if (freshUserData && newAccessToken) {
                localStorage.setItem("user",JSON.stringify(freshUserData));
                localStorage.setItem("accessToken", newAccessToken);

                updateUser(freshUserData);
                setName(updateUser.name);
            }

            navigate(`/profile/${freshUserData.id}`);
            toast.success("Profile updated successfully");

        } catch (err) {
            console.log(err);
            toast.error("Failed to update profile")
            setError("Failed to update profile")
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 space-y-4">
            <h1 className="text-xl font-bold dark: text-white">Update Profile</h1>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border rounded p-2 shadow-md dark:text-white dark:border-white" />

            <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                className="w-full border rounded p-2 resize-none shadow-md  dark:text-white dark:border-white"
                rows={3}
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="border rounded p-1 w-55 cursor-pointer shadow-md dark:text-white dark:border-white"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer px-4 py-2 disabled:opacity-50 w-full shadow-lg">
                {loading ? "Saving..." : "Save Changes"}
            </button>

        </form>
    )
}
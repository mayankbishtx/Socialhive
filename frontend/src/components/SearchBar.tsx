import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface SearchUser {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const showDropDown = query.trim() !== "" && (loading || results.length > 0);
    const navigate = useNavigate();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!query.trim()) return;

        if (debounceRef.current) clearTimeout(debounceRef.current); // cancel timeout from the previous keystroke

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/search?q=${query}`);
                setResults(res.data.users);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        }

    }, [query]);

    const handleSelect = (userId: string) => {
        setQuery("");
        setResults([]);
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);

                    if (!value.trim()) setResults([]);
                }}
                placeholder="Search Users..."
                className="border rounded-full px-4 py-1 text-sm w-48 focus:outline-none focus:w-64 transition-all border-[#484843] dark:bg-gray-200"
            />

            {showDropDown && (
                <div className="absolute top-10 left-0 bg-white dark:bg-black dark:text-white border rounded-lg shadow-lg w-64 z-50">
                    {loading && (
                        <p className="text-sm gray-400 p-3">Searching...</p>
                    )}

                    {!loading && results.length === 0 && (
                        <p className="text-sm text-gray-400 p-3">No users found</p>
                    )}

                    {results.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleSelect(user._id)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                            <img src={user.avatar || "./default-avatar.png"} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Search, X } from "lucide-react";

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
    const navigate = useNavigate();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showDropDown = query.trim() !== "" && (loading || results.length > 0);

    useEffect(() => {
        if (!query.trim()) return;

        if (debounceRef.current) clearTimeout(debounceRef.current); // cancel timeout from the previous keystroke

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
                setResults(res.data.users);

            } catch (error) {
                console.log(error);
                setResults([]);

            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        }

    }, [query]);

    const handleSelect = (username: string) => {
        setQuery("");
        setResults([]);
        navigate(`/profile/${username}`);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <div className="relative w-56">

            <div className="flex items-center w-52 md:w-full h-10 px-3 bg-gray-100 dark:bg-[#333536] border border-transparent focus-within:border-gray-300 dark:focus:focus-within:border-gray-600 rounded-xl transition-colors">
                <Search size={17} className="shrink-0 text-gray-400"/>

            <input
                type="text"
                value={query}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    
                    if (!value.trim()) setResults([]);
                }}
                placeholder="Search users"
                className="w-full ml-2 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                />  

                {query && (
                    <button type="button" onClick={clearSearch} className="shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <X/>
                    </button>
                )}

        </div>
            {showDropDown && (
                <div className="absolute top-10 left-0 w-72 overflow-y-auto bg-white dark:bg-black border border-gray-200 dark:border-[#303336] rounded-lg shadow-xl p-2 z-50">
                    {loading && (
                        <div className="px-3 py-4">
                            <p className="text-sm text-gray-400 p-3">Searching...</p>
                        </div>
                    )}

                    {!loading && (                        
                        results.map((user) => (
                            <button
                                type="button"
                                key={user._id}
                                onClick={() => handleSelect(user.username)
                            }
                            className="flex items-center gap-3 p-2.5 w-full rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-[#1d1f29] transition-colors cursor-pointer"
                            >
                            <img src={user.avatar || "./default-avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" />
                            <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                            </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
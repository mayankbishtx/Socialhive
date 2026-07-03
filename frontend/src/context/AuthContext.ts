import { createContext } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (user: User, token: string) => void;
    logout: () => void; 
    updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// WHAT shape the data is(types + the context object itself)
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
});

let currentAccessToken: string | null = null;

let onAccessTokenChange: ((token: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
    currentAccessToken = token;
};

export const setAccessTokenChangeHandler = (handler: (token: string | null) => void) =>  {
    onAccessTokenChange = handler;
}

api.interceptors.request.use((config) => {
    if (currentAccessToken) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
        originalRequest?.url?.includes("/auth/login") ||
        originalRequest?.url?.includes("/auth/register") ||
        originalRequest?.url?.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
        originalRequest._retry = true;

        try {
            const { data } = await api.post("/auth/refresh-token", {});

            const newAccessToken = data.accessToken;

            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);

            onAccessTokenChange?.(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            setAccessToken(null);

            localStorage.removeItem("accessToken");

            onAccessTokenChange?.(null);

            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
}
);

export default api;
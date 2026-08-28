import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useAuth } from "./context/useAuth";
import Navbar from "./components/Navbar";
import UpdateProfile from "./pages/UpdateProfile";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import LandingPage from "./pages/LandingPage";
import ThemeButton from "./components/ThemeButton";
import VerifyEmail from "./pages/VerifyEmail";

const Notifications = lazy(() => import("./pages/Notifications"));

export default function App() {

  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Toaster />

      <BrowserRouter>
        <ThemeButton />

        {accessToken && <Navbar />}

        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route path="/verify-email" element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          } />

          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />

          <Route path="/home" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />

          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/update-profile" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <Notifications />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <ProtectedRoute>
              <ErrorPage />
            </ProtectedRoute>
          } />
        </Routes>

      </BrowserRouter>
      <Analytics />
    </div>
  );
};
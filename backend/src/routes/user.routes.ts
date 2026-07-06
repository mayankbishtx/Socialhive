import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { followUser, getUserProfile, searchUsers, unfollowUser, updateProfile } from "../controllers/user.controller";
import upload from "../middlewares/upload.middleware";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";

const router = Router();

router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);
router.post("/:username/follow", authMiddleware, followUser);
router.delete("/:username/unfollow", authMiddleware, unfollowUser);
router.get("/search", authMiddleware, searchUsers);
router.get("/:username",optionalAuth ,getUserProfile);

export default router;
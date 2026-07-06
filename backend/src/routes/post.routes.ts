import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addComment, createPost, deleteComment, deletePost, getFeed, getUserPosts, likePost, unlikePost } from "../controllers/post.controller";
import upload from "../middlewares/upload.middleware";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/feed", authMiddleware, getFeed);
router.get("/user/:username", authMiddleware, getUserPosts);
router.delete("/:id", authMiddleware, deletePost);
router.post("/:id/like", authMiddleware, likePost);
router.delete("/:id/unlike", authMiddleware, unlikePost);
router.post("/:id/comments", authMiddleware, addComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

export default router;
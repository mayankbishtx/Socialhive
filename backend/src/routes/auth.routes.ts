import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getMe, login, logout, refreshToken, register } from "../controllers/auth.controller";
import { validateLogin, validateRegister } from "../validators/auth.validator";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many registration attempts, please try again later" },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" },
});

router.post("/register",registerLimiter, validateRegister, register);
router.post("/login",loginLimiter, validateLogin, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me",authMiddleware, getMe);

export default router;
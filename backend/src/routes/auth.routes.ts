import { Router } from "express";
import { getMe, login, logout, refreshToken, register } from "../controllers/auth.controller";
import { validateLogin, validateRegister } from "../validators/auth.validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import createRateLimiter from "../middlewares/rateLimiter";

const router = Router();

export const registerLimiter = createRateLimiter({
  maxRequest: 5,
  windowSeconds: 15 * 60, // 15 minutes
  keyPrefix: "auth:register",
});

export const loginLimiter = createRateLimiter({
  maxRequest: 10,
  windowSeconds: 15 * 60,
  keyPrefix: "auth:login",
});

router.post("/register",registerLimiter, validateRegister, register);
router.post("/login",loginLimiter, validateLogin, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me",authMiddleware, getMe);

export default router;
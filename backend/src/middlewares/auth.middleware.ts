import type { NextFunction, Response } from "express"
import type { AuthRequest } from "../types";
import { verifyAccessToken } from "../utils/generateToken";
import logger from "../config/logger";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];

        const decoded = verifyAccessToken(token);

        req.user = ({ id: decoded.id });

        next();

    } catch (error) {
        logger.error(error);
        res.status(401).json({ message: "Invalid or expired token"});
    }
};
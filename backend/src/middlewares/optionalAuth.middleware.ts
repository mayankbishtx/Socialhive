import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import { verifyAccessToken } from "../utils/generateToken";
import logger from "../config/logger";

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = verifyAccessToken(token);
            req.user = { id: decoded.id };
            
        } catch (error) {
            logger.error(error);
        }
    }
    next();
}
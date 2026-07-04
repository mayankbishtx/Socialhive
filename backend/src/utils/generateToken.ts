import jwt from "jsonwebtoken";
import logger from "../config/logger";

interface TokenPayload {
    id: string;
}

const JWT_ACCESS_SECRET= process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_ACCESS_SECRET as string, {
        expiresIn: "1d"  // had to change this to "15m"
    });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET as string, {
        expiresIn: "7d",
    });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET as string) as TokenPayload;
        return decoded;
    } catch (error) {
        logger.error(error);
        throw new Error("Invalid or exired access token");
    }
}

export const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET as string) as TokenPayload;
        return decoded;
    } catch (error) {
        logger.error(error);
        throw new Error("Invalid or expired refresh token");
    }
};
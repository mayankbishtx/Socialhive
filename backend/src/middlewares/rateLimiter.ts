import { NextFunction, Request, Response } from "express";
import redis from "../config/redis";

const redisClient = redis;

interface RateLimiterOptions {
    maxRequest: number;
    windowSeconds: number;
    keyPrefix?: string;
}

export default function createRateLimiter({ maxRequest, windowSeconds, keyPrefix = 'ratelimit' }: RateLimiterOptions) {
    return async function rateLimiter(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;
        const key = `${keyPrefix}${ip}`;

        try {
            const current = await redisClient.incr(key);

            if (current === 1) await redisClient.expire(key, windowSeconds);

            if (current > maxRequest) {
                const ttl = await redisClient.ttl(key);
                return res.status(429).json({ error: "Too many requests, try again later", retryAfter: ttl })
            }

            next();

        } catch (error) {
            console.error("Rate Limite error");
            next();
        }
    }
};
import Redis from "ioredis";
import logger from "./logger";

const redisUrl = process.env.REDIS_URL as string

if (!redisUrl) throw new Error("REDIS_URL is not defined in environment variables");

const redis = new Redis(redisUrl);

redis.on("connect", () => {
    logger.info("Redis  connected ✅");
});

redis.on("error", (error) => {
    logger.error("Redis connection failed ❌", error);
});

export default redis;
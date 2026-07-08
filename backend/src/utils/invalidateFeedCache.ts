import redis from "../config/redis";
import User from "../models/user.model";

export const invalidateUserAndFollowerFeeds = async (userId: string) => {
    const user = await User.findById(userId).select("followers");

    const cacheKeys = [
        `feed:${userId}`,
        ...(user?.followers ?? []).map(
            followerId => `feed:${followerId.toString()}`
        )
    ];

    if (cacheKeys.length > 0) await redis.del(...cacheKeys);
}
import redis from "../config/redis.js";

export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
}

export const setCache = async (key, value, ttl = 600) => {
    try {
        const data = JSON.stringify(value);
        await redis.set(key, data, 'EX', ttl);
    } catch (error) {
        console.error(`Error setting cache for key ${key}:`, error);
    }
}

export const deleteCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.error(`Error deleting cache for key ${key}:`, error);
    }
}

export const clearCache = async () => {
    try {
        await redis.flushall();
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}
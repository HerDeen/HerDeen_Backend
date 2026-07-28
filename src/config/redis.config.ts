import IORedis from "ioredis";
import cron from "node-cron";
import { Redis } from "@upstash/redis";
import {
  upstash_redis_rest_token,
  upstash_redis_rest_url,
} from "../config/system.variable";

//REDIS/MEMURAI FOR WORKER
export const createRedisConnection = () => {
  return new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null, //
  });
};

//REDIS FOR CACHING
export const redis = new Redis({
  url: upstash_redis_rest_url,
  token: upstash_redis_rest_token,
});

export const resetCahce = async (pattern: string) => {
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });
    cursor = nextCursor;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");
};

cron.schedule("0 0 * * *", async () => {
  try {
    await resetCahce("dailyPlan:*");
    console.log("Redis cache reset at midnight");
  } catch (err: any) {
    console.error("Redis cache reset failed", err);
  }
});

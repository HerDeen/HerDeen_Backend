import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 min
  max: 10, //10 requests per minute
  message: "Too many requests from this IP, please try again after 1 minute",
});

import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const throwCustomError = (message: string, statusCode: number) => {
  return new CustomError(message, statusCode);
};

export const handleCustomError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      payload: error.message,
      timeStamp: new Date(),
    });
  } else {
     console.log("🔥 INTERNAL ERROR:", error);
    res.status(500).json({
      success: false,
      payload: "Something went wrong",
      timeStamp: new Date(),
    });
  }
};

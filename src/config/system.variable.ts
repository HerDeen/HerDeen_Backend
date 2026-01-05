import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const PORT = process.env.PORT;
export const dburi = process.env.DB_CONNECTION_URI as string;
export const jwt_secret = process.env.JWT_SECRET as string;
export const jwt_exp = process.env.JWT_EXP as string;
export const admin_jwt_secret = process.env.ADMIN_JWT_SECRET as string;
export const characters = process.env.CHARACTERS as string;
export const API_KEY = process.env.API_KEY as string;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

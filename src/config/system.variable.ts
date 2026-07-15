import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const PORT = process.env.PORT;
export const dburi = process.env.DB_CONNECTION_URI as string;
export const admin_email = process.env.ADMIN_EMAIL as string;
export const admin_username = process.env.ADMIN_USERNAME;
export const admin_password = process.env.ADMIN_PASSWORD as string;
export const jwt_secret = process.env.JWT_SECRET as string;
export const jwt_exp = process.env.JWT_EXP as string;
export const jwt_refresh_token = process.env.JWT_REFRESH_TOKEN_SECRET as string;
export const jwt_refresh_exp = process.env.JWT_REFRESH_TOKEN_EXP as string;
export const resend_api_key = process.env.RESEND_API_KEY as string;
export const resend_email = process.env.RESEND_EMAIL as string;
export const admin_jwt = process.env.ADMIN_JWT_SECRET as string;
export const admin_exp = process.env.ADMIN_JWT_EXP as string;
export const admin_refresh = process.env.ADMIN_JWT_REFRESH as string;
export const admin_refresh_exp = process.env.ADMIN_JWT_REFRESH_EXP as string;

export const my_algorithm = process.env.ALGORITHM;
export const encrypt_password = process.env.ENCRYPT_PASSWORD as string;
export const API_KEY = process.env.API_KEY as string;
export const gemini_api_key = process.env.GEMINI_API_KEY;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

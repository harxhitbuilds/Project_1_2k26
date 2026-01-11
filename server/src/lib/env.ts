import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

if (!accessTokenSecret) {
  throw new Error("FATAL_ERROR: ACCESS_TOKEN_SECRET is not defined in .env");
}
if (!refreshTokenSecret) {
  throw new Error("FATAL_ERROR: REFRESH_TOKEN_SECRET is not defined in .env");
}
if (!accessTokenExpiry) {
  throw new Error("FATAL_ERROR: ACCESS_TOKEN_EXPIRY is not defined in .env");
}
if (!refreshTokenExpiry) {
  throw new Error("FATAL_ERROR: REFRESH_TOKEN_EXPIRY is not defined in .env");
}

export const ACCESS_TOKEN_SECRET = accessTokenSecret;
export const REFRESH_TOKEN_SECRET = refreshTokenSecret;
export const ACCESS_TOKEN_EXPIRY = accessTokenExpiry;
export const REFRESH_TOKEN_EXPIRY = refreshTokenExpiry;

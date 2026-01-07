import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import admin from "../config/firebase.config.js";
import type { Request } from "express";
import User from "../models/user.model.js";

interface AuthenticatedRequest extends Request {
  decodedToken?: any;
}

export const authMiddleware = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(
        401,
        "Invalid authorization header format. Expected 'Bearer <token>'"
      );
    }

    const firebaseToken = parts[1];
    if (!firebaseToken) {
      throw new ApiError(401, "Token missing in authorization header");
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseId = decodedToken.uid;

    const user = await User.findOne({ firebaseId });
    if (!user) {
      throw new ApiError(404, "User not found. Please sign in first");
    }

    req.user = user;

    next();
  }
);

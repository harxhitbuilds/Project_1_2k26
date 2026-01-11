import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import type { IAuthenticatedRequest } from "../types/request.js";

import { ACCESS_TOKEN_SECRET } from "../lib/env.js";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyAccessToken = asyncHandler(
  async (req: IAuthenticatedRequest, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ApiError(400, "Unauthorized access");
      }
      const decodedToken = (await jwt.verify(token, ACCESS_TOKEN_SECRET)) as {
        _id: string;
      };
      const user = await User.findById(decodedToken?._id).select(
        "-refreshToken"
      );

      if (!user) {
        throw new ApiError(400, "User not found");
      }
      req.user = {
        userId: user._id.toString(),
        onBoarded: user.onBoarded,
      };
      next();
    } catch (error) {
      console.log(error);
      throw new ApiError(401, "Invalid access token.");
    }
  }
);

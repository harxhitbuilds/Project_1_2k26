import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const requireOnBoard = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "User not found");
  }

  if (!req.user.onboard) {
    throw new ApiError(404, "Please complete onboarding first");
  }

  next();
});

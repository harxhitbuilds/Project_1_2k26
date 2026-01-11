import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import User from "../models/user.model.js";

import type mongoose from "mongoose";
import type { IAuthenticatedRequest } from "../types/request.js";

import jwt from "jsonwebtoken";

import { REFRESH_TOKEN_SECRET } from "../lib/env.js";

const generateAccessAndRefreshToken = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

export const oauthLogin = asyncHandler(async (req, res) => {
  const { email, name, profile, provider } = req.body;
  if (!email || !name || !profile || !provider) {
    throw new ApiError(400, "Missing informantion");
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name,
      profile,
      provider,
      onBoarded: false,
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, onBoarded: user.onBoarded, user },
        "Login Successfull"
      )
    );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(400, "Refresh token not found");
  }

  const decodedToken = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
    _id: string;
  };

  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  if (token !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Token refreshed successfully"
      )
    );
});

export const onBoard = asyncHandler(async (req: IAuthenticatedRequest, res) => {
  const { username, skills } = req.body;
  if (!username || !skills) {
    throw new ApiError(400, "Missing information");
  }
  if (!req.user) {
    throw new ApiError(400, "UnAuthorized access");
  }

  const exists = await User.findOne({ username });
  if (exists) {
    throw new ApiError(400, "Username already taken.");
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  user.username = username;
  user.skills = skills;
  user.onBoarded = true;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Onboard successfull"));
});

export const logout = asyncHandler(async (req: IAuthenticatedRequest, res) => {
  await User.findByIdAndUpdate(
    req.user?.userId,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

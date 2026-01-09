import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import admin from "../config/firebase.config.js";
import User from "../models/user.model.js";
import type { Request } from "express";

interface AuthenticatedRequest extends Request {
  decodedToken?: any;
}

export const continueWithGoogle = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    // console.log(authHeader);

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(401, "Invalid authorization header format");
    }

    const firebaseToken = parts[1];

    if (!firebaseToken) {
      throw new ApiError(401, "Token missing");
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseId = decodedToken.uid; // Use uid, not firebaseId

    let user = await User.findOne({ firebaseId });

    if (!user) {
      if (!decodedToken.name) {
        throw new ApiError(400, "User name is missing from token");
      }
      if (!decodedToken.email) {
        throw new ApiError(400, "User email is missing from token");
      }
      const userData: {
        firebaseId: string;
        name: string;
        email: string;
        profile?: string;
        onboard: boolean;
      } = {
        firebaseId,
        name: decodedToken.name,
        email: decodedToken.email,
        onboard: false,
      };
      if (decodedToken.picture) {
        userData.profile = decodedToken.picture;
      }
      user = await User.create(userData);
    }

    const expiresIn = 60 * 60 * 24 * 7 * 1000;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: expiresIn,
    };

    const sessionCookie = await admin
      .auth()
      .createSessionCookie(firebaseToken, { expiresIn });

    res.cookie("__session", sessionCookie, cookieOptions);

    res.cookie("__onboard", user.onboard.toString(), cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "User Signup Successful!"));
  }
);

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "User authenticated"));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("__session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.clearCookie("__onboard", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json(new ApiResponse(200, {}, "Logout Successfull !"));
});

export const onBoard = asyncHandler(async (req, res) => {
  const { username, skills } = req.body;
  const userId = req.user?._id;

  if (!username || !skills) {
    throw new ApiError(400, "Missing fields !");
  }
  if (!userId) {
    throw new ApiError(401, "UnAuthorized access");
  }

  let existingUser = await User.findOne({ username });
  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw new ApiError(409, "Username already taken");
  }

  let userToUpdate = await User.findById(userId);
  if (!userToUpdate) {
    throw new ApiError(404, "User not found");
  }

  userToUpdate.username = username;
  userToUpdate.skills = skills.map((skill: string) => ({ name: skill }));
  userToUpdate.onboard = true;

  await userToUpdate.save({ validateBeforeSave: true });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
  res.cookie("__onboard", "true", cookieOptions);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: userToUpdate }, "On Boarding Successfull")
    );
});

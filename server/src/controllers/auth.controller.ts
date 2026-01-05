import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import admin from "../config/firebase.config.js";

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "User authenticated"));
});

export const getSession = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(401, "Token not found");
  }
  const decoded = await admin.auth().verifyIdToken(idToken);

  const expiresIn = 60 * 60 * 24 * 7 * 1000;

  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn });

  res.cookie("__session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Session created !"));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("--session");
  return res.status(200).json(new ApiResponse(200, {}, "Logout Successfull !"));
});

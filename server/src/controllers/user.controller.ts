import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Idea from "../models/idea.model.js";

export const getMyIdeas = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  const ideas = await Idea.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { ideas }, "Ideas fetched ! "));
});

export const getMyTeams = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "User not authenticated");
  }

  const teams = await Idea.find({
    $or: [{ owner: userId }, { "teamMembers.userId": userId }],
  })
    .populate("owner", "name username profile")
    .populate("teamMembers.userId", "name username profile");

  return res
    .status(200)
    .json(new ApiResponse(200, { teams }, "Teams fetched successfully!"));
});

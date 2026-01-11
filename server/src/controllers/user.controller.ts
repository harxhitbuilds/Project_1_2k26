import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Idea from "../models/idea.model.js";

import type { IAuthenticatedRequest } from "../types/request.js";

import mongoose from "mongoose";

export const getMyIdeas = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(400, "User not authenticated");
    }

    const ideas = await Idea.find({ owner: userId })
      .populate("owner", "name username profile")
      .populate({
        path: "teamMembers.userId",
        select: "name username profile",
      });

    return res
      .status(200)
      .json(new ApiResponse(200, { ideas }, "Ideas fetched ! "));
  }
);

export const getMyTeams = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const userId = req.user?.userId;
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
  }
);

export const getMyStats = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const [
      totalIdeas,
      totalTeamsJoined,
      totalRequestsSent,
      requestsReceivedResult,
    ] = await Promise.all([
      Idea.countDocuments({ owner: userId }),

      Idea.countDocuments({ "teamMembers.userId": userId }),

      Idea.countDocuments({ "requests.userId": userId }),

      Idea.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: { $size: "$requests" } },
          },
        },
      ]),
    ]);

    const totalRequestsReceived =
      requestsReceivedResult.length > 0
        ? requestsReceivedResult[0].totalRequests
        : 0;

    const stats = {
      totalIdeas,
      totalTeamsJoined,
      totalRequestsSent,
      totalRequestsReceived,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, { stats }, "User stats fetched successfully"));
  }
);

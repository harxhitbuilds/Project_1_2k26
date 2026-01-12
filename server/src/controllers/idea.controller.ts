import type { Request } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Idea from "../models/idea.model.js";

import { generateUniqueSlug } from "../utils/slug.js";

import mongoose from "mongoose";

interface FetchIdeaRequest extends Request {
  query: {
    limit?: string;
    cursor?: string;
  };
}

import type { IAuthenticatedRequest } from "../types/request.js";

export const fetchIdeas = asyncHandler(async (req: FetchIdeaRequest, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const safeLimit = Math.min(limit, 15);

  const { cursor } = req.query;

  let query = {};

  if (cursor) {
    try {
      const { createdAt, id } = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      );
      query = {
        $or: [
          { createdAt: { $lt: new Date(createdAt) } },
          {
            createdAt: new Date(createdAt),
            _id: { $lt: id },
          },
        ],
      };
    } catch (error) {
      throw new ApiError(400, "Invalid cursor format");
    }
  }

  const ideas = await Idea.find(query)
    .populate("owner", "name username profile")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1);

  const hasMore = ideas.length > safeLimit;

  if (hasMore) ideas.pop();

  const lastPost = ideas[ideas.length - 1];

  const nextCursor =
    hasMore && lastPost
      ? Buffer.from(
          JSON.stringify({
            createdAt: lastPost.createdAt,
            id: lastPost._id,
          })
        ).toString("base64")
      : null;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ideas, cursor: nextCursor, hasMore },
        "Ideas fetched successfully"
      )
    );
});

export const fetchIdea = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(404, "Slug not found.");
  }

  const idea = await Idea.findOne({ slug }).populate(
    "owner",
    "name username profile"
  );
  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { idea }, "Idea fetched successfully"));
});

export const searchIdeas = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res
      .status(200)
      .json(new ApiResponse(200, { ideas: [] }, "Search query is empty."));
  }

  const searchQuery = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { "technologies.name": { $regex: q, $options: "i" } },
    ],
  };

  const ideas = await Idea.find(searchQuery).populate(
    "owner",
    "name username profile"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { ideas }, "Ideas searched successfully"));
});

export const uploadIdea = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const {
      title,
      description,
      technologies,
      status,
      lookingForCollaboratos,
      requirements,
    } = req.body;
    if (
      !title ||
      !description ||
      !status ||
      !Array.isArray(technologies) ||
      technologies.length === 0
    ) {
      throw new ApiError(400, "Incomplete or invalid data for posting idea.");
    }
    if (!req.user?.userId) {
      throw new ApiError(
        401,
        "Unauthorized. User must be logged in to create an idea."
      );
    }

    const slug = await generateUniqueSlug(title);
    if (!slug) {
      throw new ApiError(500, "Something went wrong with slug generator");
    }

    const idea = await Idea.create({
      title,
      description,
      technologies,
      owner: req.user?.userId,
      status,
      slug,
      lookingForCollaboratos,
      requirements,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { idea }, "Idea Uploaded"));
  }
);

export const updateIdea = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const { description, status, technologies } = req.body;
    const { slug } = req.params;
    if (!slug) {
      throw new ApiError(400, "Slug not found");
    }

    const idea = await Idea.findOne({ slug });

    if (!idea) {
      throw new ApiError(400, "Idea not found");
    }

    if (idea.owner.toString() !== req.user?.userId.toString()) {
      throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
    }

    const updateFields: { [key: string]: any } = {};
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (technologies) updateFields.technologies = technologies;

    if (Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "No update fields provided.");
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      idea._id,
      { $set: updateFields },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { updatedIdea }, "Idea updated succesfully"));
  }
);

export const deleteIdea = asyncHandler(
  async (req: IAuthenticatedRequest, res) => {
    const { slug } = req.params;
    if (!slug) {
      throw new ApiError(400, "Slug not found");
    }

    const idea = await Idea.findOne({ slug });
    if (!idea) {
      throw new ApiError(404, "Idea not found");
    }

    if (idea.owner.toString() !== req.user?.userId.toString()) {
      throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
    }

    await Idea.findByIdAndDelete(idea._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Idea removed successfully"));
  }
);

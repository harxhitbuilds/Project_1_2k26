import type { Request } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Idea from "../models/idea.model.js";
import type { ITeamMember } from "../models/idea.model.js";
import { generateUniqueSlug } from "../utils/slug.js";

interface FetchIdeaRequest extends Request {
  query: {
    limit?: string;
    cursor?: string;
  };
}

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

export const uploadIdea = asyncHandler(async (req, res) => {
  const { title, description, technologies, requirements, status } = req.body;
  if (
    !title ||
    !description ||
    !status ||
    !Array.isArray(technologies) ||
    technologies.length === 0 ||
    !Array.isArray(requirements) ||
    requirements.length === 0
  ) {
    throw new ApiError(400, "Incomplete or invalid data for posting idea.");
  }
  if (!req.user?._id) {
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
    requirements,
    owner: req.user?._id,
    status,
    slug,
  });

  return res.status(201).json(new ApiResponse(201, { idea }, "Idea Uploaded"));
});

export const updateIdea = asyncHandler(async (req, res) => {
  const { description, status, technologies, requirements } = req.body;
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(400, "Slug not found");
  }

  const idea = await Idea.findOne({ slug });

  if (!idea) {
    throw new ApiError(400, "Idea not found");
  }

  if (idea.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  const updateFields: { [key: string]: any } = {};
  if (description) updateFields.description = description;
  if (status) updateFields.status = status;
  if (technologies) updateFields.technologies = technologies;
  if (requirements) updateFields.requirements = requirements;

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
    .json(new ApiResponse(200, { idea }, "Idea updated succesfully"));
});

export const deleteIdea = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(400, "Slug not found");
  }

  const idea = await Idea.findOne({ slug });
  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  if (idea.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  await Idea.findByIdAndDelete(idea._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Idea removed successfully"));
});

export const sendRequest = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { role } = req.body;

  if (!slug) {
    throw new ApiError(400, "Slug not found");
  }

  if (!req.user) {
    throw new ApiError(403, "User not authenticated");
  }

  const idea = await Idea.findOne({ slug });
  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  const currentUser = req.user?._id;
  if (currentUser) {
    throw new ApiError(401, "Unauthorized. User must be logged in.");
  }

  if (idea.owner._id === req.user?._id) {
    throw new ApiError(400, "You are owner of this idea");
  }

  const existingRequest = idea.requests.find(
    (req) => req.userId.toString() === currentUser
  );

  if (existingRequest) {
    throw new ApiError(409, "You have already sent a request for this idea.");
  }

  const request = {
    userId: req.user._id,
    role,
    status: "pending" as const,
  };

  idea.requests.push(request);
  await idea.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { request }, "Request sent"));
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { requesterId } = req.body;
  if (!slug || !requesterId) {
    throw new ApiError(400, "Missing information");
  }

  const idea = await Idea.findOne({ slug });
  if (!idea) {
    throw new ApiError(404, "Idea not found.");
  }

  if (idea.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  if (!req.user || idea.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  const requestIndex = idea.requests.findIndex(
    (req) => req.userId.toString() === requesterId && req.status === "pending"
  );

  if (requestIndex === -1) {
    throw new ApiError(404, "Pending request from this user not found.");
  }

  const isAlreadyMember = idea.teamMembers.some(
    (member) => member.userId.toString() === requesterId
  );

  if (isAlreadyMember) {
    idea.requests.splice(requestIndex, 1);
    await idea.save();
    throw new ApiError(409, "This user is already a member of the team.");
  }

  const requestToAccept = idea.requests[requestIndex];
  if (!requestToAccept) {
    throw new ApiError(404, "Pending request from this user not found.");
  }

  const newTeamMember: ITeamMember = {
    userId: requestToAccept.userId,
    role: requestToAccept.role,
    joinedAt: new Date(),
  };

  idea.teamMembers.push(newTeamMember);

  idea.requests.splice(requestIndex, 1);

  await idea.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { idea },
        "Request accepted and user added to the team."
      )
    );
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { requesterId } = req.body;

  if (!requesterId || !slug) {
    throw new ApiError(400, "Requester ID is required.");
  }

  const idea = await Idea.findOne({ slug });
  if (!idea) {
    throw new ApiError(404, "Idea not found.");
  }

  if (idea.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  const requestIndex = idea.requests.findIndex(
    (req) => req.userId.toString() === requesterId && req.status === "pending"
  );

  if (requestIndex === -1) {
    throw new ApiError(404, "Pending request from this user not found.");
  }

  idea.requests.splice(requestIndex, 1);

  await idea.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { idea }, "Request rejected successfully."));
});

export const removeMember = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { memberId } = req.body;
  if (!slug || !memberId) {
    throw new ApiError(400, "Missing information");
  }

  const idea = await Idea.findOne({ slug });
  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  if (idea.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Forbidden: You are not the owner of this idea.");
  }

  if (idea.owner.toString() === memberId) {
    throw new ApiError(400, "The owner cannot be removed from the team.");
  }

  const memberExists = idea.teamMembers.some(
    (member) => member.userId.toString() === memberId
  );

  if (!memberExists) {
    throw new ApiError(404, "Member not found in this idea's team.");
  }

  const updatedIdea = await Idea.findByIdAndUpdate(
    idea._id,
    { $pull: { teamMembers: { userId: memberId } } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { idea: updatedIdea },
        "Team member removed successfully"
      )
    );
});

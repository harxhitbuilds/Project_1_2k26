import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import type { IAuthenticatedRequest } from "../types/request.js";

export const requireOnboarding = asyncHandler(
  async (req: IAuthenticatedRequest, res, next) => {
    if (!req.user) {
      throw new ApiError(400, "Unauthorized");
    }
    if (!req.user.onBoarded) {
      throw new ApiError(400, "Complete onboarding");
    }
    next();
  }
);

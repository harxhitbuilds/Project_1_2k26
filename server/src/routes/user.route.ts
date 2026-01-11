import express from "express";
import {
  getMyIdeas,
  getMyStats,
  getMyTeams,
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/accessToken.middleware.js";
import { requireOnboarding } from "../middlewares/onboard.middleware.js";
const userRouter = express.Router();

userRouter.get("/my-ideas", verifyAccessToken, requireOnboarding, getMyIdeas);
userRouter.get("/my-teams", verifyAccessToken, requireOnboarding, getMyTeams);
userRouter.get("/my-stats", verifyAccessToken, requireOnboarding, getMyStats);

export default userRouter;

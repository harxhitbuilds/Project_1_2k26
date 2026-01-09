import express from "express";
import { getMyIdeas, getMyTeams } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireOnBoard } from "../middlewares/onboard.middleware.js";

const userRouter = express.Router();

userRouter.get("/my-ideas", authMiddleware, requireOnBoard, getMyIdeas);
userRouter.get("/my-teams", authMiddleware, requireOnBoard, getMyTeams);

export default userRouter;

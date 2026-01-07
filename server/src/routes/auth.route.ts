import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireOnBoard } from "../middlewares/onboard.middleware.js";
import {
  continueWithGoogle,
  getMe,
  logout,
  onBoard,
} from "../controllers/auth.controller.js";

const router = express.Router();

// signup route
router.post("/google", continueWithGoogle);
// on-board route
router.post("/on-board", authMiddleware, onBoard);
// protected routes
router.get("/getMe", authMiddleware, requireOnBoard, getMe);
router.get("/logout", authMiddleware, logout);

export default router;

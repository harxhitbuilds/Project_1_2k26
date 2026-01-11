import express from "express";
import {
  logout,
  oauthLogin,
  onBoard,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middlewares/accessToken.middleware.js";
import { requireOnboarding } from "../middlewares/onboard.middleware.js";

const router = express.Router();

// oauth login
router.post("/oauth", oauthLogin);
// refresh token
router.post("/refresh", refreshToken);
// on-board route
router.post("/on-board", verifyAccessToken, onBoard);
// logout user
router.post("/logout", verifyAccessToken, requireOnboarding, logout);

export default router;

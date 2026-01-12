import express from "express";
import {
  fetchIdeas,
  fetchIdea,
  uploadIdea,
  deleteIdea,
  updateIdea,
  searchIdeas,
} from "../controllers/idea.controller.js";
import { verifyAccessToken } from "../middlewares/accessToken.middleware.js";
import { requireOnboarding } from "../middlewares/onboard.middleware.js";

const router = express.Router();

router.get("/", verifyAccessToken, requireOnboarding, fetchIdeas);
router.get("/search", verifyAccessToken, requireOnboarding, searchIdeas);

router
  .route("/:slug")
  .get(verifyAccessToken, requireOnboarding, fetchIdea)
  .patch(verifyAccessToken, requireOnboarding, updateIdea)
  .delete(verifyAccessToken, requireOnboarding, deleteIdea);

router.post("/upload", verifyAccessToken, requireOnboarding, uploadIdea);

export default router;

import express from "express";
import {
  fetchIdeas,
  fetchIdea,
  uploadIdea,
  deleteIdea,
  updateIdea,
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeMember,
} from "../controllers/idea.controller.js";
import { verifyAccessToken } from "../middlewares/accessToken.middleware.js";
import { requireOnboarding } from "../middlewares/onboard.middleware.js";

const router = express.Router();

router.get("/", verifyAccessToken, requireOnboarding, fetchIdeas);

router
  .route("/:slug")
  .get(verifyAccessToken, requireOnboarding, fetchIdea)
  .patch(verifyAccessToken, requireOnboarding, updateIdea)
  .delete(verifyAccessToken, requireOnboarding, deleteIdea);

router.post("/upload", verifyAccessToken, requireOnboarding, uploadIdea);

router
  .route("/:slug/request")
  .post(verifyAccessToken, requireOnboarding, sendRequest);
router
  .route("/:slug/accept")
  .post(verifyAccessToken, requireOnboarding, acceptRequest);
router
  .route("/:slug/reject")
  .post(verifyAccessToken, requireOnboarding, rejectRequest);
router
  .route("/:slug/remove-member")
  .post(verifyAccessToken, requireOnboarding, removeMember);

export default router;

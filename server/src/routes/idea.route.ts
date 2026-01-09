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
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireOnBoard } from "../middlewares/onboard.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireOnBoard, fetchIdeas);

router
  .route("/:slug")
  .get(authMiddleware, requireOnBoard, fetchIdea)
  .patch(authMiddleware, requireOnBoard, updateIdea)
  .delete(authMiddleware, requireOnBoard, deleteIdea);

router.post("/upload", authMiddleware, requireOnBoard, uploadIdea);

router
  .route("/:slug/request")
  .post(authMiddleware, requireOnBoard, sendRequest);
router
  .route("/:slug/accept")
  .post(authMiddleware, requireOnBoard, acceptRequest);
router
  .route("/:slug/reject")
  .post(authMiddleware, requireOnBoard, rejectRequest);
router
  .route("/:slug/remove-member")
  .post(authMiddleware, requireOnBoard, removeMember);

export default router;

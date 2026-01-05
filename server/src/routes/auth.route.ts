import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMe, getSession, logout } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/getMe", authMiddleware, getMe);
router.post("/getSession", authMiddleware, getSession);
router.get("/logout", logout);

export default router;

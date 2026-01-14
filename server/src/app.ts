import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { morganStream } from "./utils/logger.js";
import errorHandler from "./handlers/error.handler.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", {
    stream: morganStream,
  })
);

app.get("/api/health", (req, res) => {
  res.send("Server running perfectly.");
});

// routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import ideaRouter from "./routes/idea.route.js";
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/idea", ideaRouter);

app.use(errorHandler);

export default app;

import type { Request } from "express";
import type { IAuthenticatedUser } from "./user.js";

interface IAuthenticatedRequest extends Request {
  user?: IAuthenticatedUser;
}

export type { IAuthenticatedRequest };

import { Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  provider: string;
  profile?: string;
  skills: string[];
  onBoarded: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {}

interface IAuthenticatedUser {
  userId: string;
  onBoarded: boolean;
}

export type { IUser, IAuthenticatedUser };

import mongoose from "mongoose";
import type { IUser, IUserMethods, IUserModel } from "../types/user.js";

import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

import {
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
} from "../lib/env.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: ["google", "github"],
    },
    profile: {
      type: String,
      trim: true,
    },
    skills: [String],
    onBoarded: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function (): string {
  const expiresIn: StringValue = (ACCESS_TOKEN_EXPIRY as StringValue) || "1d";

  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
    },
    ACCESS_TOKEN_SECRET as Secret,
    options
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const expiresIn: StringValue = (REFRESH_TOKEN_EXPIRY as StringValue) || "1d";

  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
    },
    REFRESH_TOKEN_SECRET as Secret,
    options
  );
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;

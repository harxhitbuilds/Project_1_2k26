import "next-auth";
import "next-auth/jwt";

interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  provider: string;
  profile?: string;
  skills: string[];
  onBoarded: boolean;
  refreshToken: string;
  socialLinks: {
    github: string;
    linkedIn: string;
    x: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    onBoarded?: boolean;
    user: IUser;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    onBoarded?: boolean;
    error?: string;
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    onBoarded?: boolean;
    accessTokenExpires?: number;
    error?: string;
    user: IUser;
  }
}

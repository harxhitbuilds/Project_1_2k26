import { IUser } from "./next-auth";

type AuthStore = {
  updating: false;
  onBoard: (username: string, skills: any) => Promise<void>;
  logout: () => Promise<void>;
};

import { IIdea } from "@/types/index";
import { ParamValue } from "next/dist/server/request/params";

type IdeaStore = {
  ideas: IIdea[];
  currentIdea: IIdea | null;
  cursor: string | null;
  hasMore: boolean;
  loading: boolean;
  fetching: boolean;
  fetchIdeas: (limit?: number) => Promise<void>;
  searchIdeas: (query: string) => Promise<void>;
  fetchIdeaBySlug: (slug: ParamValue) => Promise<void>;
  uploadIdea: (data: any, onSuccess?: () => void) => Promise<void>;
  updateIdea: (
    slug: string,
    data: any,
    onSuccess?: () => void
  ) => Promise<void>;
  deleteIdea: (slug: string, onSuccess?: () => void) => Promise<void>;
  clearIdeas: () => void;
};

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

type UserStore = {
  user: IUser | null;
  userIdeas: IIdea[];
  myStats: {
    totalIdeas: number;
  } | null;
  fetching: boolean;
  fetchProfile: (username: string) => Promise<void>;
  updateProfile: (data: SocialLinks) => Promise<any>;
};

export type { AuthStore, IdeaStore, UserStore, SocialLinks };

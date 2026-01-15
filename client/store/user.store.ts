import { create } from "zustand";
import axios from "axios";

import API from "@/lib/api";
import { toast } from "sonner";

import type { UserStore, SocialLinks } from "@/types/stores";

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userIdeas: [],
  myIdeas: [],
  myTeams: [],
  fetching: false,

  async fetchMyIdeas() {
    set({ fetching: true });
    try {
      const res = await API.get("/user/my-ideas");
      set({ userIdeas: res.data.data.ideas });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to fetch your ideas.";
      toast.error(errorMessage);
    } finally {
      set({ fetching: false });
    }
  },

  updateProfile: async (data: SocialLinks) => {
    try {
      const response = await API.post("/user/update", data);
      return response.data.data.user;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to update profile.";
      toast.error(errorMessage);
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  async fetchProfile(username: string) {
    set({ fetching: true, user: null, userIdeas: [] });
    try {
      const res = await API.get(`/user/get-profile/${username}`);
      set({ user: res.data.data.user, userIdeas: res.data.data.userIdeas });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to fetch user profile.";
      toast.error(errorMessage);
      console.error("Failed to fetch profile:", error);
      throw error;
    } finally {
      set({ fetching: false });
    }
  },
}));

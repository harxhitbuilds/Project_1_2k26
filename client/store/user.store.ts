import { create } from "zustand";

import API from "@/lib/api";
import { toast } from "sonner";

import type { UserStore, SocialLinks } from "@/types/stores";

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userIdeas: [],
  myIdeas: [],
  myTeams: [],
  myStats: null,
  fetching: false,

  async fetchMyIdeas() {
    set({ fetching: true });
    try {
      const res = await API.get("/user/my-ideas");
      set({ myIdeas: res.data.data.ideas });
    } catch (error) {
      toast.error("Failed to fetch your ideas.");
    } finally {
      set({ fetching: false });
    }
  },

  async fetchMyStats() {
    set({ fetching: true });
    try {
      const res = await API.get("/user/my-stats");
      set({ myStats: res.data.data.stats });
    } catch (error) {
      toast.error("Failed to fetch your teams.");
    } finally {
      set({ fetching: false });
    }
  },

  updateProfile: async (data: SocialLinks) => {
    try {
      const response = await API.post("/user/update", data);
      return response.data.data.user;
    } catch (error) {
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
      console.error("Failed to update profile:", error);
      throw error;
    } finally {
      set({ fetching: false });
    }
  },
}));

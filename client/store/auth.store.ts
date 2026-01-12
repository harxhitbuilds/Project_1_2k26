import { create } from "zustand";
import { signOut } from "next-auth/react";

import API from "@/lib/api";

import type { AuthStore } from "@/types/stores";

export const useAuthStore = create<AuthStore>((set, get) => ({
  updating: false,

  async onBoard(username: string, skills: any) {
    try {
      const res = await API.post("/auth/on-board", { username, skills });
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed", error);
    } finally {
      await signOut({ callbackUrl: "/auth" });
    }
  },
}));

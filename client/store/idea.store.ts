import { create } from "zustand";
import API from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

import { ParamValue } from "next/dist/server/request/params";
import type { IdeaStore } from "@/types/stores";

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  currentIdea: null,
  cursor: null,
  hasMore: true,
  loading: false,
  fetching: false,

  fetchIdeas: async (limit = 6) => {
    if (!get().hasMore || get().fetching) return;
    set({ fetching: true });
    try {
      const cursor = get().cursor;
      const res = await API.get(`/idea?limit=${limit}&cursor=${cursor || ""}`);
      const { ideas: newIdeas, cursor: nextCursor, hasMore } = res.data.data;
      set((state) => ({
        ideas: cursor ? [...state.ideas, ...newIdeas] : newIdeas,
        cursor: nextCursor,
        hasMore,
      }));
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to fetch ideas.";
      toast.error(errorMessage);
    } finally {
      set({ fetching: false });
    }
  },

  searchIdeas: async (query: string) => {
    if (!query.trim()) {
      get().clearIdeas();
      await get().fetchIdeas();
      return;
    }
    set({ fetching: true, hasMore: false });
    try {
      const res = await API.get(`/idea/search?q=${query}`);
      const { ideas } = res.data.data;
      set({ ideas, fetching: false });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to search for ideas.";
      toast.error(errorMessage);
      set({ fetching: false });
    }
  },

  fetchIdeaBySlug: async (slug: ParamValue) => {
    set({ loading: true, currentIdea: null });
    try {
      const res = await API.get(`/idea/${slug}`);
      set({ currentIdea: res.data.data.idea });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to fetch idea details.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  uploadIdea: async (data, onSuccess) => {
    set({ loading: true });
    try {
      const res = await API.post("/idea/upload", data);
      set((state) => ({ ideas: [res.data.data.idea, ...state.ideas] }));
      toast.success("Idea uploaded successfully!");
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to upload idea.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  updateIdea: async (slug, data, onSuccess) => {
    set({ loading: true });
    try {
      const res = await API.patch(`/idea/${slug}`, data);
      const updatedIdea = res.data.data.idea;
      set((state) => ({
        currentIdea: updatedIdea,
        ideas: state.ideas.map((idea) =>
          idea.slug === slug ? updatedIdea : idea
        ),
      }));
      toast.success("Idea updated successfully!");
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to update idea.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  deleteIdea: async (slug, onSuccess) => {
    set({ loading: true });
    try {
      await API.delete(`/idea/${slug}`);
      set((state) => ({
        ideas: state.ideas.filter((idea) => idea.slug !== slug),
      }));
      toast.success("Idea deleted successfully.");
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Failed to delete idea.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  clearIdeas: () => set({ ideas: [], cursor: null, hasMore: true }),
}));

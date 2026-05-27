import { create } from 'zustand';
import type { Inspiration } from '../types';
import { api } from '../services/api';

interface InspirationStore {
  inspirations: Inspiration[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  selectedId: string | null;

  fetchInspirations: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  addInspiration: (content: string) => Promise<Inspiration>;
  removeInspiration: (id: string) => Promise<void>;
  selectInspiration: (id: string | null) => void;
  updateInspiration: (id: string, data: Partial<Inspiration>) => void;
  triggerAIProcess: (id: string) => Promise<void>;
}

const PAGE_SIZE = 20;

export const useInspirationStore = create<InspirationStore>((set, get) => ({
  inspirations: [],
  total: 0,
  hasMore: false,
  isLoading: false,
  isSubmitting: false,
  selectedId: null,

  fetchInspirations: async (reset = true) => {
    set({ isLoading: true });
    try {
      const result = await api.listInspirations(PAGE_SIZE, 0);
      set({
        inspirations: result.data,
        total: result.total,
        hasMore: result.hasMore,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { inspirations, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });
    try {
      const result = await api.listInspirations(PAGE_SIZE, inspirations.length);
      set({
        inspirations: [...inspirations, ...result.data],
        hasMore: result.hasMore,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addInspiration: async (content: string) => {
    set({ isSubmitting: true });
    try {
      const inspiration = await api.createInspiration(content);
      set((state) => ({
        inspirations: [inspiration, ...state.inspirations],
        total: state.total + 1,
        isSubmitting: false,
      }));
      return inspiration;
    } catch {
      set({ isSubmitting: false });
      throw new Error('Failed to create inspiration');
    }
  },

  removeInspiration: async (id: string) => {
    await api.deleteInspiration(id);
    set((state) => ({
      inspirations: state.inspirations.filter((i) => i.id !== id),
      total: state.total - 1,
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  selectInspiration: (id: string | null) => {
    set({ selectedId: id });
  },

  updateInspiration: (id: string, data: Partial<Inspiration>) => {
    set((state) => ({
      inspirations: state.inspirations.map((i) => (i.id === id ? { ...i, ...data } : i)),
    }));
  },

  triggerAIProcess: async (id: string) => {
    set((state) => ({
      inspirations: state.inspirations.map((i) =>
        i.id === id ? { ...i, ai_status: 'processing' as const } : i
      ),
    }));
    try {
      const updated = await api.processAllAI(id);
      set((state) => ({
        inspirations: state.inspirations.map((i) => (i.id === id ? updated : i)),
      }));
    } catch {
      set((state) => ({
        inspirations: state.inspirations.map((i) =>
          i.id === id ? { ...i, ai_status: 'error' as const } : i
        ),
      }));
    }
  },
}));

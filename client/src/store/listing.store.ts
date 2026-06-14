import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ListingState {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'maskani-favorites', // This saves favorites in LocalStorage
    }
  )
);
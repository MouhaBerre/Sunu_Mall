import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  shop: string;
  image?: string;
  quantity: number;
}

export type UserRole = 'client' | 'vendeur' | 'livreur' | 'admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AppState {
  cart: CartItem[];
  favorites: string[];
  user: User | null;
  hasHydrated: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  login: (user: User) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      user: null,
      hasHydrated: false,

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      })),

      isFavorite: (id) => get().favorites.includes(id),

      login: (user) => set({ user }),

      logout: () => set({ user: null }),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'sunumall-storage', // persisted in localStorage
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: number;
  restaurantName: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
}

const initialState: CartState = {
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
  restaurantId: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartRestaurantId') || 'null') : null,
  restaurantName: typeof window !== 'undefined' ? localStorage.getItem('cartRestaurantName') : null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        state.items = [];
      }
      state.restaurantId = item.restaurantId;
      state.restaurantName = item.restaurantName;
      
      const existingIndex = state.items.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
      localStorage.setItem('cartRestaurantId', JSON.stringify(state.restaurantId));
      localStorage.setItem('cartRestaurantName', state.restaurantName || '');
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        if (action.payload.quantity <= 0) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity = action.payload.quantity;
        }
      }
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurantId');
      localStorage.removeItem('cartRestaurantName');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

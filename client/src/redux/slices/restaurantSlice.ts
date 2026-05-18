import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  address: string;
  city: string;
  cuisine: string;
  rating: number;
  isOpen: boolean;
  deliveryTime: string;
  deliveryFee: number;
  _count?: { reviews: number };
}

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (params: { search?: string; cuisine?: string; city?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/restaurants', { params });
      return data.restaurants;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/restaurants/${id}`);
      return data.restaurant;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => { state.loading = true; })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRestaurantById.pending, (state) => { state.loading = true; })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;

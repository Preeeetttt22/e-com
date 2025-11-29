import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "../services/cartService";

export const fetchCartCount = createAsyncThunk("cart/fetchCount", async () => {
  const res = await getCart();
  const count = res.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  return count;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    count: 0,
  },
  reducers: {
    incrementCartCount: (state, action) => {
      state.count += action.payload || 1;
    },
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    resetCartCount: (state) => {
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartCount.fulfilled, (state, action) => {
      state.count = action.payload;
    });
  },
});

export const { incrementCartCount, setCartCount, resetCartCount } = cartSlice.actions;
export default cartSlice.reducer;
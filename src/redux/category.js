import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    value: "all",
  },
  reducers: {
    setCategory: (state, action) => {
      state.value = action.payload;
    },
  },
});

const { actions, reducer } = categorySlice;

export const { setCategory } = actions;

export default reducer;

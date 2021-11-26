import { createSlice } from "@reduxjs/toolkit";
import getSymbolFromCurrency from "currency-symbol-map";

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currency: {
      key: "USD",
      html: "$",
    },
  },
  reducers: {
    setCurrency: (state, action) => {
      const key = action.payload;
      state.currency = { key, html: getSymbolFromCurrency(key) };
    },
  },
});

const { actions, reducer } = currencySlice;

export const { setCurrency } = actions;

export default reducer;

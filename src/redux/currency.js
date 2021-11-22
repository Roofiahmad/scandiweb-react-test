import { createSlice } from "@reduxjs/toolkit";

const currencyFormat = [
  { key: "USD", text: "USD", html: <span>&#65284; </span> },
  { key: "GBP", text: "GBP", html: <span>&#163; </span> },
  { key: "AUD", text: "AUD", html: <span>&#65284; </span> },
  { key: "JPY", text: "YPN", html: <span>&#165; </span> },
  { key: "RUB", text: "RUB", html: <span>&#8381; </span> },
];

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currency: {
      key: "USD",
      html: <span>&#65284;</span>,
    },
  },
  reducers: {
    setCurrency: (state, action) => {
      const key = action.payload;
      const content = currencyFormat.filter((currency) => currency.key === key)[0].html;
      state.currency = { key, html: content };
    },
  },
});

const { actions, reducer } = currencySlice;

export const { setCurrency } = actions;

export default reducer;

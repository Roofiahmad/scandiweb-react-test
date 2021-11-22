import { combineReducers, createStore } from "@reduxjs/toolkit";
import currencyReducer from "./currency";
import cartReducer from "./cart";
import categoryReducer from "./category";

const reducer = combineReducers({
  currency: currencyReducer,
  cart: cartReducer,
  category: categoryReducer,
});

const store = createStore(reducer);

export default store;

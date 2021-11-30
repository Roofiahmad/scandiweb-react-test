import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      productList: [],
    },
    attributePopup: { toggle: false, product: {} },
  },

  reducers: {
    addToCart: (state, action) => {
      let isSameProduct = false;
      let isSameAttribute = false;
      let cartIndex;
      state.cart.productList.forEach((product, index) => {
        if (isSameAttribute) {
          return;
        }
        if (product.id === action.payload.id) {
          isSameProduct = true;
          const cartAttributesKeys = Object.keys(product.attributes);
          if (cartAttributesKeys.length === 0) {
            cartIndex = index;
            return (isSameAttribute = true);
          }
          cartAttributesKeys.forEach((cartAttr) => {
            if (product.attributes[cartAttr] === action.payload.attributes[cartAttr]) {
              cartIndex = index;
              return (isSameAttribute = true);
            }
          });
        }
      });

      if (isSameProduct && isSameAttribute) {
        state.cart.productList[cartIndex].quantity += 1;
      } else {
        const newProduct = {
          id: action.payload.id,
          quantity: 1,
          attributes: { ...action.payload.attributes },
          transaction_id: Date.now(),
        };
        state.cart.productList.push(newProduct);
      }
    },
    increaseQuantity: (state, action) => {
      const productIndex = state.cart.productList.findIndex((product) => product.transaction_id === action.payload);
      state.cart.productList[productIndex].quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const productIndex = state.cart.productList.findIndex((product) => product.transaction_id === action.payload);
      if (state.cart.productList[productIndex].quantity !== 1) {
        state.cart.productList[productIndex].quantity -= 1;
      } else {
        state.cart.productList.splice(productIndex, 1);
      }
    },
    toggleAttributeCart: (state, action) => {
      state.attributePopup = { ...action.payload };
    },
  },
});

const { actions, reducer } = cartSlice;

export const { addToCart, increaseQuantity, decreaseQuantity, toggleAttributeCart } = actions;

export default reducer;

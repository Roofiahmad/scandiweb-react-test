import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      productList: [],
    },
  },

  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
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
          cartAttributesKeys.forEach((cartAttr) => {
            if (product.attributes[cartAttr] === action.payload.attributes[cartAttr]) {
              cartIndex = index;
              return (isSameAttribute = true);
            }
          });
        }
      });

      console.log("same product", isSameProduct);
      console.log("same attribute", isSameAttribute);
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
  },
});

const { actions, reducer } = cartSlice;

export const { addToCart, increaseQuantity, decreaseQuantity } = actions;

export default reducer;

import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [], // product list store karne ke liye
    // default empty array rakho
    // taaki spread operator safely kaam kare
    cart: [], // cart items store karne ke liye
    addresses: [], // saved addresses ka array
    selectedAddress: null, //currently chosen address // currently selected address index ya value
  },
  reducers: {
    //actions
    setProducts: (state, action) => {
      state.product = action.payload; // products ko store me save karo
      // payload ko product array ke andar store karo
    },
    setCart: (state, action) => {
      state.cart = action.payload; // cart data update karo
    },
    // Address Management
    addAddress: (state, action) => {
      // if (!state.addresses)
      //   (state.addresses = []), state.addresses.push(action.payload);
      state.addresses.push(action.payload); // naya address array me add karo
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;  // selected address set karo
    },

    deleteAddress: (state, action) => {
      const deletedIndex = action.payload;
    
      state.addresses = state.addresses.filter(
        (_, index) => index !== deletedIndex
      );
    
      if (state.selectedAddress === deletedIndex) {
        state.selectedAddress = null;
      } else if (
        state.selectedAddress !== null &&
        state.selectedAddress > deletedIndex
      ) {
        state.selectedAddress -= 1;
      }
    },
    // deleteAddress: (state, action) => {
    //   state.addresses = state.addresses.filter(
    //     (_, index) => index !== action.payload // jis index ko delete karna hai usko hata do
    //   );

    //   //Reset selectedAddress if it was deleted
    //   if (state.selectedAddress === action.payload) {
    //     state.selectedAddress = null; // agar selected wahi tha to reset kar do
    //   }
    // },
  },
});

export const {
  setProducts,
  setCart,
  addAddress,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;
export default productSlice.reducer;

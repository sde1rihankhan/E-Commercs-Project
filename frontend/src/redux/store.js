import { combineReducers, configureStore } from "@reduxjs/toolkit"; // Import Redux Toolkit helpers
import productSlice from './productSlice'
import userSlice from "./userSlice"; // Import user reducer
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; // Import redux-persist helpers
import createWebStorage from "redux-persist/es/storage/createWebStorage"; // Import web storage factory

// Create storage for browser, fallback for non-browser environments
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : {
        getItem: () => Promise.resolve(null), // Safe fallback getter
        setItem: (_key, value) => Promise.resolve(value), // Safe fallback setter
        removeItem: () => Promise.resolve(), // Safe fallback remover
      };

const rootReducer = combineReducers({
  user: userSlice, // Register user reducer
  product:productSlice
});

const persistConfig = {
  key: "root", // Root key for persisted state
  version: 1, // Persist version
  storage, // Use resolved storage adapter
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Create persisted reducer

export const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persist action warnings
      },
    }),
});

export const persistor = persistStore(store); // Export persistor



// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userSlice from "./userSlice";
// import storage from "redux-persist/lib/storage";

// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   user: userSlice,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

//  export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });
// // const store = configureStore({
// //     reducer:{
// //         user:userSlice
// //     }

// // })

// export default store;

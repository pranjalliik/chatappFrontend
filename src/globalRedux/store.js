import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

import storage from "redux-persist/lib/storage";

import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import userReducer from "./Slices/userSlice"; // Importing userSlice
import msgReducer from "./Slices/msgSlice"; // Importing msgSlice
import receiverReducer from "./Slices/receiverSlice"
import  idxReducer from "./Slices/idxSlice"
import conversationReducer from './Slices/ConversationSlice'
// Configuration for persisting only the user state from userSlice
const persistConfig  = {
  key: "user", // Key for user state in storage
  storage: storage,
  whitelist: ["user"], // Specify which part of the state to persist
};

// Create a persisted reducer for userSlice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Combine reducers; msgReducer is not persisted
const rootReducer = combineReducers({
  user: persistedUserReducer,
  msg: msgReducer,
  receiver : receiverReducer,
  idx : idxReducer,
  conv : conversationReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


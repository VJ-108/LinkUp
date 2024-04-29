import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import socketSlice from "./slices/socketSlice";
import chatSlice from "./slices/chatSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
    chat: chatSlice,
  },
});
export default store;

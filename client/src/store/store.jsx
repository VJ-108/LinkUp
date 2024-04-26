import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import socketSlice from "./slices/socketSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
  },
});
export default store;

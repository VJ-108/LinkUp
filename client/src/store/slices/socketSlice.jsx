import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket-detail",
  initialState: {
    onlineUsers: {},
  },
  reducers: {
    OnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { OnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;

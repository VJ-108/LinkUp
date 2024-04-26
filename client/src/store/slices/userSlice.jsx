import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user-detail",
  initialState: {
    isRegistered: false,
    isloggedIn: false,
  },
  reducers: {
    registered: (state, action) => {
      state.isRegistered = action.payload;
    },
    loggedIn: (state, action) => {
      state.isloggedIn = action.payload;
    },
  },
});

export const { registered, loggedIn } = userSlice.actions;
export default userSlice.reducer;

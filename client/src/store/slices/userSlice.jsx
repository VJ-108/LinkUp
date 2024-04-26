import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user-detail",
  initialState: {
    isRegistered: false,
    isloggedIn: false,
    User: {},
  },
  reducers: {
    registered: (state, action) => {
      state.isRegistered = action.payload;
    },
    loggedIn: (state, action) => {
      state.isloggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.User = action.payload;
    },
  },
});

export const { registered, loggedIn, setUser } = userSlice.actions;
export default userSlice.reducer;

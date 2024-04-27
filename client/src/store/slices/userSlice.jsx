import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user-detail",
  initialState: {
    isRegistered: false,
    isloggedIn: false,
    User: {},
    currentReceiver: {},
    currentGroup: {},
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
    setCurrentReceiver: (state, action) => {
      state.currentReceiver = action.payload;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
  },
});

export const {
  registered,
  loggedIn,
  setUser,
  setCurrentReceiver,
  setCurrentGroup,
} = userSlice.actions;
export default userSlice.reducer;

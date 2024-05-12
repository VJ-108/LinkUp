import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user-detail",
  initialState: {
    isRegistered: false,
    isloggedIn: false,
    User: {},
    currentReceiver: {},
    currentGroup: {},
    contact: [],
    change_profile: "",
    Group: {},
    ln: "en",
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
    setContact: (state, action) => {
      state.contact = action.payload;
    },
    setChange_Profile: (state, action) => {
      state.change_profile = action.payload;
    },
    setGroup: (state, action) => {
      state.Group = action.payload;
    },
    setLanguage: (state, action) => {
      state.ln = action.payload;
    },
  },
});

export const {
  registered,
  loggedIn,
  setUser,
  setCurrentReceiver,
  setCurrentGroup,
  setContact,
  setChange_Profile,
  setGroup,
  setLanguage,
} = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat-detail",
  initialState: {
    isChatPanelVisible: true,
    chats: [],
  },
  reducers: {
    setIsChatPanelVisible: (state, action) => {
      state.isChatPanelVisible = action.payload;
    },
    toggleChatPanelVisibility: (state) => {
      state.isChatPanelVisible = !state.isChatPanelVisible;
    },
    setChat: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
  },
});

export const {
  setIsChatPanelVisible,
  toggleChatPanelVisibility,
  setChat,
  addChat,
} = chatSlice.actions;
export default chatSlice.reducer;

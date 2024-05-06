import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat-detail",
  initialState: {
    isChatPanelVisible: true,
    chats: [],
    showParticipant: false,
    filteredUsers: [],
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
    setShowParticipant: (state, action) => {
      state.showParticipant = action.payload;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
  },
});

export const {
  setIsChatPanelVisible,
  toggleChatPanelVisibility,
  setChat,
  addChat,
  setShowParticipant,
  setFilteredUsers,
} = chatSlice.actions;
export default chatSlice.reducer;

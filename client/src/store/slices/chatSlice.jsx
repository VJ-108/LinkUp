import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat-detail",
  initialState: {
    isChatPanelVisible: true,
  },
  reducers: {
    setIsChatPanelVisible: (state, action) => {
      state.isChatPanelVisible = action.payload;
    },
    toggleChatPanelVisibility: (state) => {
      state.isChatPanelVisible = !state.isChatPanelVisible;
    },
  },
});

export const { setIsChatPanelVisible, toggleChatPanelVisibility } =
  chatSlice.actions;
export default chatSlice.reducer;

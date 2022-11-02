import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { AlertColor } from "@mui/material/Alert/Alert";
import { Feedback } from "../../types/constants";

interface feedbackValueState {
  severity: AlertColor;
  content: string;
}

interface feedbackState {
  on: boolean;
  value: feedbackValueState;
}

const initialState: feedbackState = {
  on: false,
  value: {
    severity: Feedback.Success,
    content: "",
  },
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    showFeedback: (state, action: PayloadAction<feedbackValueState>) => {
      state.on = true;
      state.value = action.payload;
    },
    closeFeedback: (state) => {
      state.on = false;
    },
  },
});

export const { showFeedback, closeFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;

import { closeFeedback, showFeedback } from "../state/slices/feedbackSlice";
import { AppDispatch } from "../state/store";
import { Feedback } from "../types/constants";
import { useAppDispatch } from "./../state/hooks";

export const feedback = (
  dispatch: AppDispatch,
  severity: Feedback,
  content: string,
  setTime = true,
  amount = 2000
) => {
  
  dispatch(
    showFeedback({
      severity,
      content,
    })
  );

  if (setTime) {
    const timeoutID = setTimeout(() => {
      dispatch(closeFeedback());
      clearTimeout(timeoutID);
    }, amount);
  }
};

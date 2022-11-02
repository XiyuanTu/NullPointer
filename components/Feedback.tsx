import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Alert, { AlertProps } from "@mui/material/Alert";
import { AlertColor } from "@mui/material/Alert/Alert";
import { styled } from "@mui/material/styles";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { showFeedback, closeFeedback } from "../state/slices/feedbackSlice";

const StyledAlert = styled(Alert)<AlertProps>(({ theme }) => ({
  position: "absolute",
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: "9999",
}));

export const Feedback = () => {
  const dispatch = useAppDispatch();
  const { on, value } = useAppSelector((state) => state.feedback);

  const [isFeedbackOn, setIsFeedbackOn] = useState(on);
  const [feedbackValue, setFeedbackValue] = useState(value);

  useEffect(() => {
    setIsFeedbackOn(on);
  }, [on]);

  useEffect(() => {
    setFeedbackValue(value);
  }, [value]);

  if (isFeedbackOn) {
    return ReactDOM.createPortal(
      <StyledAlert
        severity={feedbackValue.severity}
        onClose={() => {
          dispatch(closeFeedback());
        }}
      >
        {feedbackValue.content}
      </StyledAlert>,
      document.getElementById("feedback") as Element
    );
  }

  return <></>;
};

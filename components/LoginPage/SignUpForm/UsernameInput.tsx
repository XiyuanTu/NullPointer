import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useFormControl } from "@mui/material/FormControl";
import {
  verifyUsername,
  usernameFormatCheck,
} from "../../../utils/auth/usernameValidation";
import { useAppDispatch } from "../../../state/hooks";
import { Feedback } from "../../../types/constants";
import {
  closeFeedback,
  showFeedback,
} from "../../../state/slices/feedbackSlice";
import { feedback } from "../../../utils/feedback";

interface IProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setUsernameStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsernameInput = ({ inputRef, setUsernameStatus }: IProps) => {
  const { focused } = useFormControl() || {};
  const dispatch = useAppDispatch();
  // usernameInputEdited: if the username input has been edited before
  const [usernameInputEdited, setUsernameInputEdited] = useState(false);
  const [usernameInputShowError, setUsernameInputShowError] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);

  useEffect(() => {
    setUsernameStatus(isValidUsername);
  }, [isValidUsername]);

  const handleUsernameOnBlur = async () => {
    const username = inputRef.current!.value;

    if (!usernameInputEdited) return;

    if (!usernameFormatCheck(username)) {
      setUsernameHelperText("What's your username?");
      setUsernameInputShowError(true);
      return;
    }

    try {
      const isUsernameNotTaken = await verifyUsername(username);
      if (!isUsernameNotTaken) {
        setUsernameHelperText("Username has already been taken!");
        setUsernameInputShowError(true);
        return;
      }

      setUsernameHelperText("");
      setUsernameInputShowError(false);
      setIsValidUsername(true);
    } catch (e) {
      feedback(dispatch, Feedback.Error, "Can not connect to server. Please try later.", )
    }
  };

  const handleUsernameOnChange = () => {
    setUsernameInputEdited(true);
    setUsernameHelperText("");
    setUsernameInputShowError(false);
    setIsValidUsername(false);
  };
  return (
    <TextField
      color={isValidUsername ? "success" : undefined}
      focused={isValidUsername || focused}
      error={usernameInputShowError}
      helperText={usernameHelperText}
      onBlur={handleUsernameOnBlur}
      onChange={handleUsernameOnChange}
      sx={{ mb: 2 }}
      id="username"
      label="Username"
      inputRef={inputRef}
      fullWidth
    />
  );
};

export default UsernameInput;

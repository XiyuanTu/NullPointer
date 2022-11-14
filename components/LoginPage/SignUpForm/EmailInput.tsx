import { useState, useEffect } from "react";
import { useFormControl } from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import {
  emailFormatCheck,
  verifyEmail,
} from "../../../utils/auth/emailValidation";
import { useDispatch } from "react-redux";
import { Feedback } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";

interface IProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setEmailStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailInput = ({ inputRef, setEmailStatus }: IProps) => {
  const { focused } = useFormControl() || {};
  const dispatch = useDispatch();
  // emailInputEdited: if the email input has been edited before
  const [emailInputEdited, setEmailInputEdited] = useState(false);
  const [emailInputShowError, setEmailInputShowError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    setEmailStatus(isValidEmail);
  }, [isValidEmail]);

  const handleEmailOnBlur = async () => {
    const email = inputRef.current!.value;

    if (!emailInputEdited) return;

    if (!emailFormatCheck(email)) {
      setEmailHelperText("Invalid email!");
      setEmailInputShowError(true);
      return;
    }

    try {
      const isEmailNotTaken = await verifyEmail(email);
      if (!isEmailNotTaken) {
        setEmailHelperText("Email has already been taken!");
        setEmailInputShowError(true);
        return;
      }
      setEmailHelperText("");
      setEmailInputShowError(false);
      setIsValidEmail(true);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Can not connect to server. Please try later."
      );
    }
  };

  const handleEmailOnChange = () => {
    setEmailInputEdited(true);
    setEmailHelperText("");
    setEmailInputShowError(false);
    setIsValidEmail(false);
  };

  return (
    <TextField
      error={emailInputShowError}
      helperText={emailHelperText}
      inputRef={inputRef}
      name="email"
      sx={{ mb: 2 }}
      id="email"
      label="Email"
      fullWidth
      color={isValidEmail ? "success" : undefined}
      focused={isValidEmail || focused}
      onBlur={handleEmailOnBlur}
      onChange={handleEmailOnChange}
    />
  );
};

export default EmailInput;

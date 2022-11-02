import { useState, useEffect } from "react";
import { useFormControl } from "@mui/material/FormControl";
import { TextField } from "@mui/material";

interface IProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setEmailStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailInput = ({ inputRef, setEmailStatus }: IProps) => {
  const { focused } = useFormControl() || {};

  // emailInputEdited: if the email input has been edited before
  const [emailInputEdited, setEmailInputEdited] = useState(false);
  const [emailInputShowError, setEmailInputShowError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    setEmailStatus(isValidEmail);
  }, [isValidEmail]);

  const emailFormatCheck = (email: string): boolean => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const handleEmailOnBlur = () => {
    const email = inputRef.current!.value;

    if (!emailInputEdited) return;

    if (!emailFormatCheck(email)) {
      setEmailHelperText("Invalid email!");
      setEmailInputShowError(true);
      return;
    }

    setEmailHelperText("");
    setEmailInputShowError(false);
    setIsValidEmail(true);
  };

  const handleEmailOnChange = () => {
    const email = inputRef.current!.value;

    setEmailInputEdited(true);
    setEmailHelperText("");
    setEmailInputShowError(false);
    setIsValidEmail(emailFormatCheck(email));
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

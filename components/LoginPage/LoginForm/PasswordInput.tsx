import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormControl } from "@mui/material/FormControl";

interface IProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setPasswordStatus: React.Dispatch<React.SetStateAction<boolean>>;
  isValidPassword: boolean;
  setIsValidPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordInput = ({
  inputRef,
  setPasswordStatus,
  isValidPassword,
  setIsValidPassword,
}: IProps) => {
  const { focused } = useFormControl() || {};

  const [showPassword, setShowPassword] = useState(false);
  // passwordInputEdited: if the password input has been edited before
  const [passwordInputEdited, setPasswordInputEdited] = useState(false);
  const [passwordInputShowError, setPasswordInputShowError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const passwordFormatCheck = (password: string) => password.length >= 8;

  useEffect(() => {
    setPasswordStatus(isValidPassword);
    isValidPassword && setPasswordHelperText("");
  }, [isValidPassword]);

  const handlePasswordOnBlur = () => {
    const password = inputRef.current!.value;

    if (!passwordInputEdited) return;

    if (!passwordFormatCheck(password)) {
      setPasswordHelperText("Must be 8 characters or longer");
      setPasswordInputShowError(true);
      return;
    }

    setPasswordHelperText("");
    setIsValidPassword(true);
  };

  const handlePasswordOnChange = () => {
    const password = inputRef.current!.value;

    setPasswordInputEdited(true);
    setPasswordInputShowError(false);
    setIsValidPassword(passwordFormatCheck(password));
  };

  return (
    <FormControl
      sx={{ mb: 2 }}
      variant="outlined"
      error={passwordInputShowError}
      onBlur={handlePasswordOnBlur}
      color={isValidPassword ? "success" : undefined}
      focused={isValidPassword || focused}
      fullWidth
    >
      <InputLabel htmlFor="password">Password</InputLabel>
      <OutlinedInput
        id="password"
        name="password"
        onChange={handlePasswordOnChange}
        inputRef={inputRef}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
      <FormHelperText>{passwordHelperText}</FormHelperText>
    </FormControl>
  );
};

export default PasswordInput;

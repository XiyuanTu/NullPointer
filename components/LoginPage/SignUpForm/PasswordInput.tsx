import { useState, useEffect } from "react";
import {
  Box,
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
import { passwordFormatCheck } from '../../../utils/auth/passwordValidation'

interface IProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setPasswordStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordInput = ({ inputRef, setPasswordStatus }: IProps) => {
  const { focused } = useFormControl() || {};

  const [showPassword, setShowPassword] = useState(false);
  // passwordInputEdited: if the password input has been edited before
  const [passwordInputEdited, setPasswordInputEdited] = useState(false);
  const [passwordInputShowError, setPasswordInputShowError] = useState(false);
  const [showPasswordHelperText, setShowPasswordHelperText] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  useEffect(() => {
    setPasswordStatus(isValidPassword);
    isValidPassword && setShowPasswordHelperText(false);
  }, [isValidPassword]);


  const handlePasswordOnBlur = () => {
    const password = inputRef.current!.value;

    setShowPasswordHelperText(false);

    if (!passwordInputEdited) return;

    if (!passwordFormatCheck(password)) {
      setShowPasswordHelperText(true);
      setPasswordInputShowError(true);
      return;
    }

    setIsValidPassword(true);
  };

  const handlePasswordOnChange = () => {
    const password = inputRef.current!.value;

    setPasswordInputEdited(true);
    setPasswordInputShowError(false);
    setIsValidPassword(passwordFormatCheck(password));
  };

  const handlePasswordOnFocus = () => {
    !isValidPassword &&setShowPasswordHelperText(true);
  };

  return (
    <FormControl
      onBlur={handlePasswordOnBlur}
      error={passwordInputShowError}
      sx={{ mb: 2 }}
      color={isValidPassword ? "success" : undefined}
      focused={isValidPassword || focused}
      variant="outlined"
      onFocus={handlePasswordOnFocus}
      fullWidth
    >
      <InputLabel htmlFor="password">Password</InputLabel>
      <OutlinedInput
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        onChange={handlePasswordOnChange}
        inputRef={inputRef}
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
      {showPasswordHelperText && (
        <Box sx={{ fontSize: 11 }}>
          <FormHelperText>Must be 8 characters or longer</FormHelperText>
          <FormHelperText>
            Must contain at least 1 numeric character
          </FormHelperText>
          <FormHelperText>
            Must contain at least 1 lowercase character
          </FormHelperText>
          <FormHelperText>
            Must contain at least 1 uppercase character
          </FormHelperText>
        </Box>
      )}
    </FormControl>
  );
};

export default PasswordInput;

import { useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { Box, Button, Stack, Divider, Typography } from "@mui/material";
import Logo from "../../Logo";
import EmailInput from "./EmailInput";
import PasswordInput from "../LoginForm/PasswordInput";
import ExternalLogin from "./ExternalLogin";
import { useAppDispatch } from "../../../state/hooks";
import { closeLoginPage } from "../../../state/slices/loginSlice";
import { closeFeedback } from "../../../state/slices/feedbackSlice";
import { Feedback } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";

interface IProps {
  setLoggingIn: (state: boolean) => void;
}

const LoginForm = ({ setLoggingIn }: IProps) => {
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // get the state from the email and password component, so that we can decide if the button should be disabled
  const [emailStatus, setEmailStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isSignInBtnDisabled, setIsSignInBtnDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSignInBtnDisabled(true);

    feedback(dispatch, Feedback.Info, "Logging in...", false);

    const res = await signIn("credentials", {
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
      redirect: false,
    });

    if (res!.ok) {
      dispatch(closeLoginPage());
      dispatch(closeFeedback());
    } else {
      if (res!.error === "undefined") {
        feedback(
          dispatch,
          Feedback.Error,
          "Can not connect to server. Please try later..."
        );
      } else {
        feedback(dispatch, Feedback.Error, "Incorrect email or password.");
        passwordRef.current!.value = "";
        setPasswordStatus(false);
        setIsValidPassword(false);
      }
    }

    setIsSignInBtnDisabled(false);
  };

  return (
    <Stack
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Logo />
      </Box>
      <EmailInput inputRef={emailRef} setEmailStatus={setEmailStatus} />
      <PasswordInput
        inputRef={passwordRef}
        setPasswordStatus={setPasswordStatus}
        isValidPassword={isValidPassword}
        setIsValidPassword={setIsValidPassword}
      />
      <Button
        disabled={!emailStatus || !passwordStatus || isSignInBtnDisabled}
        type="submit"
        variant="contained"
        sx={{ mb: 3, textTransform: "none", borderRadius: 10 }}
      >
        Log In
      </Button>

      <Button
        variant="outlined"
        sx={{
          mb: 2,
          textTransform: "none",
          borderColor: "#E2E8F0",
          borderRadius: 10,
          ":hover": { borderColor: "#E2E8F0", bgcolor: "#E2E8F0" },
        }}
      >
        <Typography sx={{ color: "black", fontSize: "0.875rem" }}>
          Forgot password?
        </Typography>
      </Button>

      <Divider sx={{ mb: 2, color: "#8e8e8e" }}>OR</Divider>

      <ExternalLogin icon={FcGoogle} provider="Google" />
      <ExternalLogin icon={BsGithub} provider="Github" />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Typography sx={{ mr: 1, fontSize: "0.875rem" }}>
          Don&apos;t have an account?
        </Typography>
        <Button
          onClick={() => setLoggingIn(false)}
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Sign up
        </Button>
      </Box>
    </Stack>
  );
};

export default LoginForm;

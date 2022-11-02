import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Stack, Box, Typography, Button } from "@mui/material";
import { GiCompass } from "react-icons/gi";
import UsernameInput from "./UsernameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { closeLoginPage } from "../../../state/slices/loginSlice";
import { useAppDispatch } from "../../../state/hooks";
import axios from "axios";
import {
  showFeedback,
  closeFeedback,
} from "../../../state/slices/feedbackSlice";
import { Feedback } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";

interface IProps {
  setLoggingIn: (state: boolean) => void;
}

const SignUpForm = ({ setLoggingIn }: IProps) => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // get the state from the username, email and password component, so that we can decide if the button should be disabled
  const [usernameStatus, setUsernameStatus] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);

  // useEffect(() => {
  //   console.log(session)
  //   if (session) {
  //     dispatch(closeFeedback());
  //   }
  // }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current!.value;
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    const formData = { username, email, password };
    try {
      await axios.post("http://localhost:3000/api/auth/signup", formData);

      feedback(dispatch, Feedback.Success, "Sign up successfully. Logging in...", false)

      await signIn("credentials", {
        email,
        password,
        redirect: false,
        // callbackUrl: '/notes'
      });

      dispatch(closeLoginPage());
      dispatch(closeFeedback());
    } catch (error) {
      feedback(dispatch, Feedback.Error, "Fail to sign up. Internal error. Please try later.")

    }
  };

  return (
    <Stack
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <GiCompass
          style={{
            color: "#007fff",
            marginRight: "0.5rem",
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
          }}
        />
      </Box>
      <Typography
        align="center"
        sx={{ fontSize: 25, fontWeight: "bold", mb: 3 }}
      >
        Join NullPointer today
      </Typography>

      <UsernameInput
        inputRef={usernameRef}
        setUsernameStatus={setUsernameStatus}
      />
      <EmailInput inputRef={emailRef} setEmailStatus={setEmailStatus} />
      <PasswordInput
        inputRef={passwordRef}
        setPasswordStatus={setPasswordStatus}
      />

      <Typography align="center" sx={{ fontSize: 12, mb: 3, color: "#8e8e8e" }}>
        By signing up, you agree to my Terms, Privacy Policy and Cookies Policy.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        sx={{ mb: 3, textTransform: "none", borderRadius: 10 }}
        disabled={!usernameStatus || !emailStatus || !passwordStatus}
      >
        Sign Up
      </Button>

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography sx={{ mr: 1, fontSize: "0.875rem" }}>
          Have an account?
        </Typography>
        <Button
          onClick={() => setLoggingIn(true)}
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Log in
        </Button>
      </Box>
    </Stack>
  );
};

export default SignUpForm;

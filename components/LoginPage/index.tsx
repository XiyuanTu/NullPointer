import { useState } from "react";
import ReactDOM from "react-dom";
import { alpha, Box, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { closeLoginPage } from "../../state/slices/loginSlice";
import { useAppDispatch } from "../../state/hooks";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const LoginPage = () => {
  const [loggingIn, setLoggingIn] = useState(true);

  const dispatch = useAppDispatch();

  return ReactDOM.createPortal(
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        bgcolor: alpha("#fff", 0.5),
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Box
        className="m-1"
        sx={{
          position: "relative",
          px: 10,
          py: 5,
          bgcolor: "#fff",
          border: "1px solid #dbdbdb",
          width: "22vw",
          minHeight: "80vh",
        }}
      >
        <Fab
          onClick={() => dispatch(closeLoginPage())}
          color="primary"
          size="small"
          aria-label="close"
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            bgcolor: "#fff",
            border: "none",
            boxShadow: "none",
            ":hover": { bgcolor: "#E2E8F0" },
          }}
        >
          <CloseIcon sx={{ color: "black" }} />
        </Fab>
        {loggingIn ? (
          <LoginForm setLoggingIn={setLoggingIn} />
        ) : (
          <SignUpForm setLoggingIn={setLoggingIn} />
        )}
      </Box>
    </Box>,
    document.getElementById("loginPage") as Element
  );
};

export default LoginPage;

import { Button } from "@mui/material";
import { IconType } from "react-icons";
import { signIn } from "next-auth/react";
import { useAppDispatch } from "../../../state/hooks";
import { Feedback } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";

type Provider = "Facebook" | "Google" | "Github";

interface IProps {
  icon: IconType;
  provider: Provider;
}

const ExternalLogin = ({ icon: Icon, provider }: IProps) => {
  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    feedback(dispatch, Feedback.Info, "Logging in...", false);
    signIn(provider.toLowerCase());
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Icon />}
      sx={{
        mb: 1,
        color: "black",
        textTransform: "none",
        borderRadius: 10,
        borderColor: "#E2E8F0",
        ":hover": { borderColor: "#E2E8F0", bgcolor: "#F4F9FD" },
      }}
      onClick={handleOnClick}
    >
      Sign in with {provider}
    </Button>
  );
};

export default ExternalLogin;

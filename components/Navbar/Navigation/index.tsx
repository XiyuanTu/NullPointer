import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import NavbarMenuItem from "./NavbarMenuItem";
import { openLoginPage } from "../../../state/slices/loginSlice";
import { useAppDispatch } from "../../../state/hooks";
import { ButtonBase, Tooltip } from "@mui/material";
import { feedback } from "../../../utils/feedback";
import { Feedback } from "../../../types/constants";

const Navigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSignOutBtnDisabled, setIsSignInBtnDisabled] = useState(false);
  const [isToProfileBtnDisabled, setIsToProfileBtnDisabled] = useState(false);
  const [isToNotebookBtnDisabled, setIsToNotebookBtnDisabled] = useState(false);
  const [isToForumBtnDisabled, setIsToForumBtnDisabled] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(async () => {
    setIsSignInBtnDisabled(true);

    try {
      await signOut({ callbackUrl: "/", redirect: false });
      await router.push("/");
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to log out. Internal error. Please try later."
      );
    }
    setIsSignInBtnDisabled(true);
  }, []);

  const handleNavigateToProfile = useCallback(async () => {
    setIsToProfileBtnDisabled(true);
    await router.push("/profile");
    setIsToProfileBtnDisabled(false);
  }, []);

  const handleNavigateToForum = useCallback(async () => {
    setIsToForumBtnDisabled(true);
    await router.push("/forum");
    setIsToForumBtnDisabled(false);
  }, []);

  const handleNavigateToNotebook = useCallback(async () => {
    setIsToNotebookBtnDisabled(true);
    await router.push("/notes");
    setIsToNotebookBtnDisabled(false);
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 10 }}>
      {session &&
        (session.user.image ? (
          <Tooltip title="Profile" arrow>
            <ButtonBase
              disabled={isToProfileBtnDisabled}
              onClick={handleNavigateToProfile}
            >
              <Avatar
                sx={{
                  width: "2rem",
                  height: "2rem",
                  color: "primary.main",
                  "&:hover": { cursor: "pointer" },
                }}
                src={session.user.image}
              />
            </ButtonBase>
          </Tooltip>
        ) : (
          <Tooltip title="Profile" arrow>
            <ButtonBase
              disabled={isToProfileBtnDisabled}
              onClick={handleNavigateToProfile}
            >
              <Avatar
                sx={{
                  width: "2rem",
                  height: "2rem",
                  color: "primary.main",
                  "&:hover": { cursor: "pointer" },
                }}
                onClick={handleNavigateToProfile}
              >
                {session.user.name!.substring(0, 1).toUpperCase()}
              </Avatar>
            </ButtonBase>
          </Tooltip>
        ))}
      <Box sx={{ display: "flex", gap: 1 }}>
        {session ? (
          <>
            <NavbarMenuItem
              icon={ForumOutlinedIcon}
              tooltipTitle="forum"
              onClick={handleNavigateToForum}
              // disabled={is}
            />
            <NavbarMenuItem
              icon={CreateOutlinedIcon}
              tooltipTitle="notebook"
              onClick={handleNavigateToNotebook}
            />
            <NavbarMenuItem
              icon={LogoutIcon}
              tooltipTitle="log out"
              onClick={handleLogOut}
            />
          </>
        ) : (
          <NavbarMenuItem
            icon={LoginIcon}
            tooltipTitle="log in"
            onClick={() => dispatch(openLoginPage())}
          />
        )}
      </Box>
    </Box>
  );
};

export default Navigation;

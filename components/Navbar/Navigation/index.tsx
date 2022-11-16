import { useCallback, useEffect } from "react";
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
import { Tooltip } from "@mui/material";
import { useIsRouterChanging } from "../../../hooks";

const Navigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isRouterChanging = useIsRouterChanging(); 

  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(async () => {
    await signOut({ callbackUrl: "/", redirect: false });
    router.push("/");
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 10 }}>
      {session &&
        (session.user.image ? (
          <Tooltip title="Profile" arrow>
            <Avatar
              sx={{
                width: "2rem",
                height: "2rem",
                color: "primary.main",
                "&:hover": { cursor: "pointer" },
              }}
              src={session.user.image}
              onClick={() => !isRouterChanging && router.push("/profile")}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Profile" arrow>
            <Avatar
              sx={{
                width: "2rem",
                height: "2rem",
                color: "primary.main",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => !isRouterChanging && router.push("/profile")}
            >
              {session.user.name!.substring(0, 1).toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      <Box sx={{ display: "flex", gap: 1 }}>
        {session ? (
          <>
            <NavbarMenuItem
              icon={ForumOutlinedIcon}
              tooltipTitle="forum"
              onClick={() => router.push("/forum")}
            />
            <NavbarMenuItem
              icon={CreateOutlinedIcon}
              tooltipTitle="notebook"
              onClick={() => router.push("/notes")}
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

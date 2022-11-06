import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NavbarMenuItem from "./NavbarMenuItem";

import { openLoginPage } from "../../../state/slices/loginSlice";
import { useAppDispatch } from "../../../state/hooks";
import UserAvatar from "../../UserAvatar";

const Navigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(async () => {
    await signOut({ callbackUrl: "http://localhost:3000/", redirect: false });
    router.push("/");
  }, []);

  const handleCurrentUserProfile = useCallback(() => {
    router.push("/profile");
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 10 }}>
      {session &&
        // <UserAvatar image={session.user.image} name={session.user.name}/>
        (session.user.image ? (
          <Avatar
            sx={{ width: "2rem", height: "2rem", color: "primary.main", '&:hover': {cursor: 'pointer'}}}
            src={session.user.image}
            onClick={handleCurrentUserProfile}
          />
        ) : (
          <Avatar
            sx={{ width: "2rem", height: "2rem", color: "primary.main", '&:hover': {cursor: 'pointer'}}}
            onClick={handleCurrentUserProfile}
          >
            {session.user.name!.substring(0, 1).toUpperCase()}
          </Avatar>
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
              icon={NotificationsNoneOutlinedIcon}
              tooltipTitle="notifications"
              badgeContent={100}
              onClick={() => {}}
            />
            <NavbarMenuItem
              icon={SettingsOutlinedIcon}
              tooltipTitle="settings"
              onClick={() => {}}
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

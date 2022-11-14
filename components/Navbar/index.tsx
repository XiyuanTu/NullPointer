import React from "react";
import Logo from "../Logo";
import Navigation from "./Navigation";
import NavbarSearch from "./NavbarSearch";
import Box from "@mui/material/Box";
import LoginPage from "../../components/LoginPage";
import { useAppSelector } from "../../state/hooks";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const onLoginPage = useAppSelector((state) => state.login.value);
  const { data: session, status } = useSession();

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        justifyContent: "space-between",
        alignItems: "center",
        height: "8vh",
        px: { xs: 10, xl: 16 },
        bgcolor: "#ffffff",
        zIndex: 999,
      }}
    >
      <Box sx={{ mr: { xs: 2, md: 10 } }}>
        <Logo />
      </Box>
      {session && <NavbarSearch />}

      <Navigation />
      {onLoginPage && <LoginPage />}
    </Box>
  );
};

export default Navbar;

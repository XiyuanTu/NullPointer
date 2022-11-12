import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const NavbarSearch = () => {
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (router.pathname === "/forum") {
      router.push(
        {
          pathname: "/forum",
          query: { search: inputRef.current!.value.trim() },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push({
        pathname: "/forum",
        query: { search: inputRef.current!.value.trim() },
      });
    }
  }, [router.pathname]);

  const handleEnter = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", handleEnter);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keypress", handleEnter);
      }
    };
  }, [inputRef]);

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        mr: 3,
        justifyContent: "space-between",
        alignItems: "center",
        width: "700px",
        height: "2rem",
        bgcolor: "#fafafa",
        border: "2px solid #E2E8F0",
        borderRadius: "0.5rem",
        "&:focus-within, &:hover": { borderColor: "#CBD5E1" },
      }}
      elevation={0}
    >
      <InputBase
        inputRef={inputRef}
        placeholder="Search for notes..."
        sx={{
          "& .MuiInputBase-input": {
            p: "0px",
          },
          ml: "0.5rem",
          color: "#667481",
          bgcolor: "#fafafa",
          fontSize: "15px",
          width: "100%"
        }}
        inputProps={{ "aria-label": "Search..." }}
      />
      <IconButton
        type="button"
        sx={{ p: "4px" }}
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon sx={{ color: "primary.main", fontSize: "20px" }} />
      </IconButton>
    </Paper>
  );
};

export default NavbarSearch;

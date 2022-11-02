import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useSession } from "next-auth/react";

const NavbarSearch = () => {
  const { data: session, status } = useSession();

  if (!session) {
    return <></>
  }

  return (
    <Paper
      component="form"
      sx={{display: 'flex', mr: 3, justifyContent: 'space-between', alignItems: 'center', width: '700px', height: '2rem', bgcolor: '#fafafa', border: '2px solid #E2E8F0', borderRadius: '0.5rem', "&:focus-within, &:hover": {borderColor: '#CBD5E1'}}}
      elevation= {0}
    >
      <InputBase
        placeholder="Search for notes..."
        sx={{
          "& .MuiInputBase-input": {
            p: "0px",
          },
          ml: '0.5rem', color: '#667481', bgcolor: '#fafafa', fontSize: '15px',
        }}
        inputProps={{ "aria-label": "Search..." }}
      />
      <IconButton type="button" sx={{p: '4px'}} aria-label="search">
        <SearchIcon sx={{color: 'primary.main', fontSize: '20px'}}/>
      </IconButton>
    </Paper>
  );
};

export default NavbarSearch;

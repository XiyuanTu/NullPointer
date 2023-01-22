import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1400,
      xl: 1800,
    },
  },
  palette: {
    primary: {
      main: "#007fff",
    },
  },
});

export default theme;

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

const links = [
  {
    name: "Contact Me",
    path: "https://www.linkedin.com/in/xiyuan",
  },
  {
    name: "FAQs",
  },
  {
    name: "Source Code",
    path: "https://github.com/XiyuanTu/NullPointer",
  },
  {
    name: "Terms and Privacy",
  },
];

const Footer = () => {
  const navigateToExternalUrl = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "9rem",
        height: "11vh",
        bgcolor: "#ffffff",
      }}
    >
      <Typography> &copy;2022 XIYUAN TU</Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        {links.map((link, index) => (
          <Typography
            key={index}
            sx={{
              ":hover": { cursor: "pointer", textDecoration: "underline" },
            }}
            onClick={() => link.path && navigateToExternalUrl(link.path)}
          >
            {link.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;

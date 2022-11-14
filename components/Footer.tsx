import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
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
        <Typography>Contact Me</Typography>
        <Typography>FAQs</Typography>
        <Typography>Source Code</Typography>
        <Typography>Terms and Privacy</Typography>
      </Box>
    </Box>
  );
};

export default Footer;

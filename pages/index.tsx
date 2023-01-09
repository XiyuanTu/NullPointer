import { useEffect } from "react";
import MarkdownEditorForShow from "../components/MDEditor/ForShow";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/notes");
    }
  }, [session]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mt: "9vh",
          px: "8rem",
          pb: "3.5rem",
          height: "79vh",
          bgcolor: "#ffffff",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ ml: "6rem" }}>
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "3.75rem",
              lineHeight: 1.2,
            }}
          >
            Take Notes
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", fontSize: "3.75rem", lineHeight: 1.2 }}
          >
            While You Code
          </Typography>
          <Typography
            sx={{
              width: "32rem",
              mt: "2rem",
              pl: "0.5rem",
              fontFamily: "-apple-system",
              fontSize: 22,
            }}
          >
            NullPointer offers you a markdown based note-taking editor and a
            file system tree to help you take and sort out notes quickly. Also,
            feel free to share your notes and check out the forum when you are
            tormented by bugs.
          </Typography>
        </Box>

        <Box sx={{ mr: "6rem", width: "50rem" }}>
          <MarkdownEditorForShow height={500} />
        </Box>
      </Box>

      <Divider sx={{ height: "1vh", bgcolor: "#ffffff" }} />

      <Footer />
    </>
  );
}

export default HomePage;

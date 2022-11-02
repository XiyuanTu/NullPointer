import { useEffect } from 'react'
import MarkdownEditorForShow from "../components/MDEditor/ForShow";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session) {
      router.push('/notes')
    }
  }, [session])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mt: '9vh',
          px: "8rem",
          pb: "3.5rem",
          height: '79vh',
          gap: "6rem",
          bgcolor: '#ffffff'
        }}
      >
        <Box sx={{ mt: "6rem" }}>
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
          <Typography sx={{ width: "32rem", mt: "2rem", pl: "0.5rem" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            impedit, repellat deserunt accusamus porro laboriosam laudantium
            magnam natus, nobis quis eligendi maxime aliquid. Hic consequuntur
            itaque animi officia odit quos.
          </Typography>
        </Box>
        <Box sx={{ mt: "4rem", width: "42rem" }}>
          <MarkdownEditorForShow height={450} />
        </Box>
      </Box>

      <Divider sx={{height: '1vh', bgcolor: '#ffffff'}}/>

      <Footer/>
    </>
  );
}

export default HomePage;


import { Box, Container, CircularProgress } from "@mui/material";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import UserProfile from "../../components/Profile/UserProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import { feedback } from "../../utils/feedback";
import { Feedback } from "../../types/constants";
import { useAppDispatch } from "../../state/hooks";

const CurrentUserProfile = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(
    router.query.tabValue ? parseInt(router.query.tabValue as string) : 0
  );

  useEffect(() => {
    try {
      if (session) {
        (async function getUser() {
          const {
            data: { user },
          } = await axios.get("/api/user/" + session.user.id);
          setUser(user);
        })();
      }
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to process. Internal error. Please try later."
      );
    }
  }, [session]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "48vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ display: "flex", pt: 3, mt: "9vh" }}>
      <Box sx={{ width: "20%", mr: 2 }}>
        <UserProfile user={user} setTabValue={setTabValue} />
      </Box>
      <Box sx={{ width: "80%" }}>
        <ProfileTabs
          user={user}
          setUser={setUser}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      </Box>
    </Container>
  );
};

export default CurrentUserProfile;

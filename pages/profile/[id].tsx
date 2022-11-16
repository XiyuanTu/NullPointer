import { Box, Container, CircularProgress } from "@mui/material";
import ProfileTabs from "../../components/OtherProfile/ProfileTabs";
import UserProfile from "../../components/OtherProfile/UserProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "../../state/hooks";
import axios from "axios";
import { feedback } from "../../utils/feedback";
import { Feedback } from "../../types/constants";

const OtherUserProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);

  /* When navigating to the same page in Next.js, 
  the page's state will not be reset by default as react does not unmount unless the parent component has changed.
  /profile/1 and /profile/2 are considered the same page
  This is the workaround */
  useEffect(() => {
    try {
      if (session) {
        (async function getUser() {
          const {
            data: { user },
          } = await axios.get("/api/user/" + session.user.id);
          setUser(user);
          const {
            data: { user: currentOtherUser },
          } = await axios.get("/api/user/" + router.query.id);
          setUser(user);
          setOtherUser(currentOtherUser);
          setTabValue(0);
        })();
      }
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to process. Internal error. Please try later."
      );
    }
  }, [session, router.query.id]);

  if (!user || !otherUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "48vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ display: "flex", pt: 3, mt: "9vh" }}>
      <Box sx={{ width: "20%", mr: 2 }}>
        <UserProfile
          user={user}
          setTabValue={setTabValue}
          otherUser={otherUser}
          setOtherUser={setOtherUser}
        />
      </Box>
      <Box sx={{ width: "80%" }}>
        <ProfileTabs
          user={user}
          setUser={setUser}
          tabValue={tabValue}
          setTabValue={setTabValue}
          otherUser={otherUser}
        />
      </Box>
    </Container>
  );
};

export default OtherUserProfile;

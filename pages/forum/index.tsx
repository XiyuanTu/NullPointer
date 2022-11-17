import { Box, Container, CircularProgress } from "@mui/material";
import ForumContent from "../../components/Forum/ForumContent";
import UserInfoComponent from "../../components/Forum/UserInfoComponent";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../state/hooks";
import { useSession } from "next-auth/react";
import axios from "axios";
import { feedback } from "../../utils/feedback";
import { Feedback } from "../../types/constants";

interface IProps {
  convertedData: [];
  convertedUser: User;
  convertedWhoToFollow: User[];
}

const Forum = ({}: IProps) => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [forumData, setForumData] = useState<[] | null>(null);
  const [whoToFollow, setWhoToFollow] = useState<User[] | null>(null);

  useEffect(() => {
    try {
      if (session) {
        (async function getUser() {
          const {
            data: { user, forumData, whoToFollow },
          } = await axios.get("/api/forum/" + session.user.id);
          setCurrentUser(user);
          setForumData(forumData);
          setWhoToFollow(whoToFollow);
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

  if (!currentUser || !forumData || !whoToFollow) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "48vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ display: "flex", pt: 3, mt: "9vh" }}>
      <Box sx={{ width: "75%", mr: 2 }}>
        <ForumContent
          convertedData={forumData}
          user={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </Box>
      <Box sx={{ width: "25%" }}>
        <UserInfoComponent
          user={currentUser}
          setCurrentUser={setCurrentUser}
          whoToFollow={whoToFollow}
        />
      </Box>
    </Container>
  );
};

export default Forum;

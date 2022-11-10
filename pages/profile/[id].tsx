import { Box, Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import UserAccount from "../../models/user/userAccountModel";
import connectDB from "../../utils/connectDB";
import { convertUser } from "../../utils/notes";
import { authOptions } from "../api/auth/[...nextauth]";
import ProfileTabs from "../../components/OtherProfile/ProfileTabs";
import UserProfile from "../../components/OtherProfile/UserProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface IProps {
  user: User;
  otherUser: User;
}

const OtherUserProfile = ({
  user: currentUser,
  otherUser: currentOtherUser,
}: IProps) => {
  const router = useRouter();
  const [user, setUser] = useState(currentUser);
  const [otherUser, setOtherUser] = useState(currentOtherUser);
  const [tabValue, setTabValue] = useState(0);

  /* When navigating to the same page in Next.js, 
  the page's state will not be reset by default as react does not unmount unless the parent component has changed.
  /profile/1 and /profile/2 are considered the same page
  This is the workaround */
  useEffect(() => {
    setUser(currentUser);
    setOtherUser(currentOtherUser);
    setTabValue(0);
  }, [router.query.id]);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const {
    user: { id },
  } = session!;

  const otherUserId = context.params!.id;

  await connectDB();

  let user = await UserAccount.findById(id).lean();
  let otherUser = await UserAccount.findById(otherUserId).lean();

  user = convertUser(user);
  otherUser = convertUser(otherUser);

  return { props: { user, otherUser } };
};

export default OtherUserProfile;

import {
  Box,
  Container,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import UserAccount from "../../models/user/userAccountModel";
import connectDB from "../../utils/connectDB";
import { convertUser } from "../../utils/notes";
import { authOptions } from "../api/auth/[...nextauth]";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import UserProfile from "../../components/Profile/UserProfile";
import {useState} from 'react'
import { useRouter } from "next/router";

interface IProps {
  user: User;
}

const CurrentUserProfile = ({ user: currentUser }: IProps) => {
  const router = useRouter()
  const [user, setUser] = useState(currentUser)
  const [tabValue, setTabValue] = useState(router.query.tabValue ? parseInt(router.query.tabValue as string) : 0);

  return (
    <Container maxWidth="lg" sx={{display: 'flex', pt: 3, mt: "9vh" }}>
      <Box sx={{ width: "20%", mr: 2 }}>
        <UserProfile user={user} setTabValue={setTabValue}/>
      </Box>
      <Box sx={{ width: "80%"}}>
        <ProfileTabs user={user} setUser={setUser} tabValue={tabValue} setTabValue={setTabValue} />
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

  await connectDB();

  let user = await UserAccount.findById(id).lean();

  user = convertUser(user);

  return { props: { user } };
};

export default CurrentUserProfile;

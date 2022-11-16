import { Box, Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import UserAccount from "../../models/user/userAccountModel";
import connectDB from "../../utils/connectDB";
import { convertUser } from "../../utils/notes";
import { authOptions } from "../api/auth/[...nextauth]";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import UserProfile from "../../components/Profile/UserProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

interface IProps {
  user: User;
}

const CurrentUserProfile = () => {
  const { data: session, status } = useSession();
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
      console.log(e);
    }
  }, [session]);

  if (!user) {
    return <>Loading...</>;
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await unstable_getServerSession(
//     context.req,
//     context.res,
//     authOptions
//   );

//   const {
//     user: { id },
//   } = session!;

//   await connectDB();

//   let user = await UserAccount.findById(id).lean();

//   user = convertUser(user);

//   return { props: { user } };
// };

export default CurrentUserProfile;

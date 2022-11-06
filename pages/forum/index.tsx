import { Paper, Box, Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ForumContent from "../../components/ForumContent";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import connectDB from "../../utils/connectDB";
import Note from "../../models/note/noteModel";
import { convertForumData, convertUser } from "../../utils/notes";
import UserInfo from "../../components/ForumContent/UserInfo";
import UserAccount from "../../models/user/userAccountModel";

interface IProps {
  convertedData: [];
  convertedUser: User
}

const Forum = ({ convertedData: notes, convertedUser: user }: IProps) => {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', pt: 3, mt: "9vh" }}>
        <Box sx={{width: '75%', mr: 2}}>
          <ForumContent notes={notes} user={user}/>
        </Box>
        <Box sx={{width: '25%'}}>
          <UserInfo/>
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

  await connectDB();

  const id = session!.user.id;
  const user = await UserAccount.findById(id, {email: 0, password: 0}).lean()
  const convertedUser = convertUser(user)

  const notes = await Note.find(
    { public: true, userId: {$nin: convertedUser.blocks} },
    { name: 0, public: 0, favorite: 0, belongTo: 0 }
  ).lean();

  const convertedData = await convertForumData(notes);
  
  return { props: { convertedData, convertedUser} };
};

export default Forum;

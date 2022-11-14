import { Box, Container } from "@mui/material";
import ForumContent from "../../components/Forum/ForumContent";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import connectDB from "../../utils/connectDB";
import Note from "../../models/note/noteModel";
import { convertForumData, convertUser } from "../../utils/notes";
import UserInfoComponent from "../../components/Forum/UserInfoComponent";
import UserAccount from "../../models/user/userAccountModel";
import { useState } from "react";

interface IProps {
  convertedData: [];
  convertedUser: User;
  convertedWhoToFollow: User[];
}

const Forum = ({
  convertedData,
  convertedUser,
  convertedWhoToFollow,
}: IProps) => {
  const [currentUser, setCurrentUser] = useState(convertedUser);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", pt: 3, mt: "9vh" }}>
      <Box sx={{ width: "75%", mr: 2 }}>
        <ForumContent
          convertedData={convertedData}
          user={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </Box>
      <Box sx={{ width: "25%" }}>
        <UserInfoComponent
          user={currentUser}
          setCurrentUser={setCurrentUser}
          whoToFollow={convertedWhoToFollow}
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

  await connectDB();

  const id = session!.user.id;
  const user = await UserAccount.findById(id, { email: 0, password: 0 }).lean();
  const convertedUser = convertUser(user);

  const notes = await Note.find(
    { public: true, userId: { $nin: convertedUser.blocks } },
    { name: 0, public: 0, favorite: 0, belongTo: 0 }
  ).lean();

  const convertedData = await convertForumData(notes);
  convertedData.sort((a, b) => b.like - a.like);

  const whoToFollow: User[] = await UserAccount.find(
    {
      _id: { $nin: [...convertedUser.blocks, ...convertedUser.following, id] },
    },
    { email: 0, password: 0 }
  ).lean();

  const convertedWhoToFollow = whoToFollow
    .map((user) => convertUser(user))
    .sort((a, b) => b.following.length - a.following.length)
    .slice(0, 6);

  return { props: { convertedData, convertedUser, convertedWhoToFollow } };
};

export default Forum;

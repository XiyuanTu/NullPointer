import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Note from "../../models/note/noteModel";
import UserAccount from "../../models/user/userAccountModel";
import connectDB from "../../utils/connectDB";
import { convertNote, convertUser } from "../../utils/notes";
import { authOptions } from "../api/auth/[...nextauth]";
import { Container } from "@mui/material";
import UserAvatar from "../../components/UserAvatar";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Comment from "../../components/Comment";
import DetailedNote from "../../components/DetailedNote";

interface IProps {
  user: User;
  note: Note;
  author: User;
}

const DetailedNotePage = ({ user, note, author }: IProps) => {
  return (
    <Container maxWidth="md" sx={{ mt: "12vh" }}>
      <DetailedNote user={user} note={note} author={author} />
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
  const noteId = context.params!.id;

  await connectDB();

  const user = await UserAccount.findById(id, {
    email: 0,
    password: 0,
    __v: 0,
  }).lean();
  const convertedUser = convertUser(user);
  const note = await Note.findById(noteId, { __v: 0 }).lean();
  const convertedNote = convertNote(note);
  const author = await UserAccount.findById(note.userId, {
    email: 0,
    password: 0,
    __v: 0,
  }).lean();
  const convertedAuthor = convertUser(author);
  return {
    props: {
      user: convertedUser,
      note: convertedNote,
      author: convertedAuthor,
    },
  };
};

export default DetailedNotePage;

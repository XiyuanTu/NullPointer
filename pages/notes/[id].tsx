
import { Container, CircularProgress, Box } from "@mui/material";
import "github-markdown-css";
import DetailedNote from "../../components/DetailedNote";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { feedback } from "../../utils/feedback";
import { useAppDispatch } from "../../state/hooks";
import { Feedback } from "../../types/constants";
import axios from "axios";
import { convertNote } from "../../utils/note";


const DetailedNotePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    try {
      if (session) {
        (async function getUser() {
          const {
            data: { user },
          } = await axios.get("/api/user/" + session.user.id);
          setUser(user);

          const {
            data: { note },
          } = await axios.get("/api/note/" + router.query.id);
          const convertedNote = convertNote(note);
          setNote(convertedNote)
          if (session.user.id === convertedNote.userId) {
            setAuthor(user);
          } else {
            const {
              data: { user: author },
            } = await axios.get("/api/user/" + convertedNote.userId);
            setAuthor(author);
          }
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

  if (!user || !note || !author) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "48vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: "12vh" }}>
      <DetailedNote user={user} note={note} author={author} />
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
//   const noteId = context.params!.id;

//   await connectDB();

//   const user = await UserAccount.findById(id, {
//     email: 0,
//     password: 0,
//     __v: 0,
//   }).lean();
//   const convertedUser = convertUser(user);
//   const note = await Note.findById(noteId, { __v: 0 }).lean();
//   const convertedNote = convertNote(note);
//   const author = await UserAccount.findById(note.userId, {
//     email: 0,
//     password: 0,
//     __v: 0,
//   }).lean();
//   const convertedAuthor = convertUser(author);
//   return {
//     props: {
//       user: convertedUser,
//       note: convertedNote,
//       author: convertedAuthor,
//     },
//   };
// };

export default DetailedNotePage;

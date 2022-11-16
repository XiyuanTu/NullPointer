import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import FileTree from "./FileTree";
import Header from "./Header";
import NoteInfoComponent from "./NoteInfoComponent";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import axios from "axios";
import { Feedback, FileOrFolder } from "../../types/constants";
import { convertTreeViewData } from "../../utils/note";
import { feedback } from "../../utils/feedback";
import { getFolderIds } from "../../utils/fileSystem";
import { setNote } from "../../state/slices/noteSlice";

interface IProps {
  showInfo: boolean;
}

const Sidebar = ({ showInfo }: IProps) => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<RenderTree | null>(null);
  const selectedId = useAppSelector((state) => state.selectedId.value);
  const [noteId, setNoteId] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [folderIds, setFolderIds] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      if (session) {
        (async function getFilesAndFolders() {
          const {
            data: { folders },
          } = await axios.get("/api/folders/" + session.user.id);
          const {
            data: { notes: files },
          } = await axios.get("/api/notes/" + session.user.id);
          const newFolders = folders.map((folder: any) => ({
            ...folder,
            type: FileOrFolder.Folder,
          }));
          const newFiles = files.map((file: any) => {
            delete file.mdText;
            return {
              ...file,
              type: FileOrFolder.File,
            };
          });
          const convertedData = convertTreeViewData([
            ...newFolders,
            ...newFiles,
          ]);
          setData(convertedData);
          setFolderIds(getFolderIds(convertedData));
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

  useEffect(() => {
    // if selectedId refers to a file
    if (
      selectedId !== "root" &&
      folderIds &&
      !folderIds.includes(selectedId) &&
      selectedId !== noteId
    ) {
      setNoteId(selectedId);

      (async function getNote() {
        const {
          data: { note },
        } = await axios.get(`/api/note/${selectedId}`);
        note.createdAt = note.createdAt.toLocaleString();
        note.lastModified = note.lastModified.toLocaleString();
        if (note.firstPublicAt) {
          note.firstPublicAt = note.firstPublicAt.toLocaleString();
        }
        dispatch(setNote(note));
      })();
    }
  }, [selectedId, folderIds]);

  if (!data || !folderIds) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "40vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "91vh",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        flexFlow: "column",
        bgcolor: "#ffffff",
      }}
    >
      {showInfo ? (
        <NoteInfoComponent />
      ) : (
        <>
          <Header
            data={data}
            setData={setData}
            folderIds={folderIds}
            setFolderIds={setFolderIds}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          <FileTree
            data={data}
            setData={setData}
            folderIds={folderIds}
            setFolderIds={setFolderIds}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </>
      )}
    </Box>
  );
};

export default Sidebar;

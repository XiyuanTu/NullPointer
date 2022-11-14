import { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import Draggable from "react-draggable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Sidebar from "../../components/Sidebar";
import connectDB from "../../utils/connectDB";
import { useWindowWidth, useWindowHeight } from "../../hooks";
import axios from "axios";
import { convertTreeViewData } from "../../utils/notes";
import MarkdownEditorForEdit from "../../components/MDEditor/ForEdit";
import MarkdownEditorForShow from "../../components/MDEditor/ForShow";
import mongoose from "mongoose";
import { useAppDispatch, useAppSelector } from "../../state/hooks";

import { getFolderIds } from "../../utils/fileSystem";
import { setNote } from "../../state/slices/noteSlice";
import ToggleButton from "../../components/ToggleButton";
import Title from "../../components/Title";
import Folder from "../../models/note/folderModel";
import Note from "../../models/note/noteModel";
import { FileOrFolder } from "../../types/constants";

interface IProps {
  convertedData: RenderTree;
}

const Notes = ({ convertedData }: IProps) => {
  const initRatio = 0.2; // How much sidebar takes place
  const dividerWidth = 5;
  const heightRatioWithNote = 0.849; //0.909
  const heightRatioWithoutNote = 0.909;
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth();
  const selectedId = useAppSelector((state) => state.selectedId.value);
  const note = useAppSelector((state) => state.note.value);
  const dispatch = useAppDispatch();

  const [sidebarWidth, setSidebarWidth] = useState(
    windowWidth * initRatio + "px"
  );
  const [editorWidth, setEditorWidth] = useState(
    windowWidth * (1 - initRatio) - dividerWidth + "px"
  );
  const [height, setHeight] = useState(windowHeight * heightRatioWithoutNote);
  const [x, setX] = useState(windowWidth * initRatio);
  const [folderIds, setFolderIds] = useState(getFolderIds(convertedData));
  const [noteId, setNoteId] = useState("");
  const [showInfo, setShowInfo] = useState(false); // show info or file tree

  useEffect(() => {
    setSidebarWidth(x + "px");
    setEditorWidth(windowWidth - x - dividerWidth + "px");
  }, [x]);

  useEffect(() => {
    setX(windowWidth * initRatio);
    setSidebarWidth(windowWidth * initRatio + "px");
    setEditorWidth(windowWidth * (1 - initRatio) - dividerWidth + "px");
  }, [windowWidth]);

  useEffect(() => {
    if (note) {
      setHeight(windowHeight * heightRatioWithNote);
    } else {
      setHeight(windowHeight * heightRatioWithoutNote);
    }
  }, [windowHeight, note]);

  useEffect(() => {
    // if selectedId refers to a file
    if (
      selectedId !== "root" &&
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
  }, [selectedId]);

  return (
    <Box sx={{ display: "flex", width: "100vw", mt: "9vh" }}>
      <Box sx={{ mr: "5px" }}>
        <Box sx={{ width: sidebarWidth }}>
          <Sidebar
            convertedData={convertedData}
            folderIds={folderIds}
            setFolderIds={setFolderIds}
            showInfo={showInfo}
          />
        </Box>
      </Box>

      {/*这个position: 'absolute'立大功*/}

      <Draggable
        position={{ x, y: 0 }}
        axis="x"
        bounds={{ left: windowWidth * 0.1, right: windowWidth * 0.9 }}
        onDrag={(e, data) => setX(data.x)}
      >
        <Divider
          orientation="vertical"
          sx={{
            width: dividerWidth + "px",
            height: "91vh",
            m: 0,
            position: "absolute",
            cursor: "ew-resize",
            bgcolor: "#ffffff",
            "& .MuiDivider-wrapperVertical": { px: 0 },
          }}
        />
      </Draggable>
      <Box sx={{ width: editorWidth }}>
        {note ? (
          <>
            <Title />
            <MarkdownEditorForEdit height={height} />
            <ToggleButton showInfo={showInfo} setShowInfo={setShowInfo} />
          </>
        ) : (
          <MarkdownEditorForShow height={height} />
        )}
      </Box>
    </Box>
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

  const folders = await Folder.find(
    { userId: new mongoose.Types.ObjectId(id) },
    { userId: 0 }
  ).lean();

  const newFolders = folders.map((folder) => ({
    ...folder,
    type: FileOrFolder.Folder,
  }));

  let files = await Note.find(
    { userId: new mongoose.Types.ObjectId(id) },
    { userId: 0, mdText: 0 }
  ).lean();

  const newFiles = files.map((file) => ({ ...file, type: FileOrFolder.File }));

  const convertedData = convertTreeViewData([...newFolders, ...newFiles]);

  return { props: { convertedData } };
};

export default Notes;

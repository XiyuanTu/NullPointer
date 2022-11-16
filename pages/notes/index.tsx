import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Sidebar from "../../components/Sidebar";
import { useWindowWidth, useWindowHeight } from "../../hooks";
import MarkdownEditorForEdit from "../../components/MDEditor/ForEdit";
import MarkdownEditorForShow from "../../components/MDEditor/ForShow";
import { useAppSelector } from "../../state/hooks";
import ToggleButton from "../../components/ToggleButton";
import Title from "../../components/Title";

interface IProps {
  convertedData: RenderTree;
}

const Notes = () => {
  const initRatio = 0.2; // How much sidebar takes place
  const dividerWidth = 5;
  const heightRatioWithNote = 0.849; //0.909
  const heightRatioWithoutNote = 0.909;
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth();
  const note = useAppSelector((state) => state.note.value);

  const [sidebarWidth, setSidebarWidth] = useState(
    windowWidth * initRatio + "px"
  );
  const [editorWidth, setEditorWidth] = useState(
    windowWidth * (1 - initRatio) - dividerWidth + "px"
  );
  const [height, setHeight] = useState(windowHeight * heightRatioWithoutNote);
  const [x, setX] = useState(windowWidth * initRatio);
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

  return (
    <Box sx={{ display: "flex", width: "100vw", mt: "9vh" }}>
      <Box sx={{ mr: "5px" }}>
        <Box sx={{ width: sidebarWidth }}>
          <Sidebar showInfo={showInfo} />
        </Box>
      </Box>

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

export default Notes;

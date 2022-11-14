import { useState } from "react";
import { Box } from "@mui/material";
import FileTree from "./FileTree";
import Header from "./Header";
import NoteInfoComponent from "./NoteInfoComponent";

interface IProps {
  convertedData: RenderTree;
  folderIds: string[];
  setFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  showInfo: boolean;
}

const Sidebar = ({
  convertedData,
  folderIds,
  setFolderIds,
  showInfo,
}: IProps) => {
  const [data, setData] = useState(convertedData);
  const [expanded, setExpanded] = useState<string[]>([]);

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

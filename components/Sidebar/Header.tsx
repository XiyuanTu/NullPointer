import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { BsFolderPlus } from "react-icons/bs";
import { AiOutlineFileAdd } from "react-icons/ai";
import { GoFold, GoUnfold } from "react-icons/go";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import {
  getNodeAndParentById,
  findIndexOfFirstFile,
  nameGenerator,
} from "../../utils/fileSystem";
import axios from "axios";
import { Feedback, FileOrFolder } from "../../types/constants";
import { feedback } from "../../utils/feedback";

interface IProps {
  data: RenderTree;
  setData: React.Dispatch<React.SetStateAction<RenderTree>>;
  folderIds: string[];
  setFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  expanded: string[];
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>;
}

const Header = ({
  data,
  setData,
  folderIds,
  setFolderIds,
  expanded,
  setExpanded,
}: IProps) => {
  const selectedId = useAppSelector((state) => state.selectedId.value);
  const dispatch = useAppDispatch();

  const handleCreateNewNote = async () => {
    const res = getNodeAndParentById(selectedId, data)!;
    try {
      let requestBody: any = {
        lastModified: new Date(),
      };
      //if the selected node is not the root node
      if (Array.isArray(res)) {
        const [node, parent] = res;
        //if the selected node is a folder
        if (node.children) {
          const name = nameGenerator(FileOrFolder.File, node);
          requestBody = {
            ...requestBody,
            name,
            belongTo: node.id,
            type: FileOrFolder.File,
          };
          const {
            data: { nodeId },
          } = await axios.post("/api/note", requestBody);
          const newNode = {
            id: nodeId,
            name,
            level: node.level + 1,
            isNew: true,
          };
          node.children.push(newNode);
          if (!expanded.includes(selectedId)) {
            setExpanded([...expanded, selectedId]);
          }
        } else {
          const name = nameGenerator(FileOrFolder.File, parent);
          requestBody = { ...requestBody, name, type: FileOrFolder.File };
          if (parent.id !== "root") {
            requestBody.belongTo = node.id;
          }
          const {
            data: { nodeId },
          } = await axios.post("/api/note", requestBody);
          const newNode = {
            id: nodeId,
            name,
            level: node.level,
            isNew: true,
          };
          parent.children!.push(newNode);
        }
      } else {
        const name = nameGenerator(FileOrFolder.File, res);
        requestBody = { ...requestBody, name, type: FileOrFolder.File };
        const {
          data: { nodeId },
        } = await axios.post("/api/note", requestBody);
        const newNode = {
          id: nodeId,
          name,
          level: res.level + 1,
          isNew: true,
        };
        res.children!.push(newNode);
      }
      setData({ ...data });
    } catch (err) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to create the file. Internal error. Please try later."
      );
    }
  };

  const handleCreateNewFolder = async () => {
    const res = getNodeAndParentById(selectedId, data)!;

    try {
      let newNode: RenderTree;
      //if the selected node is not the root node
      if (Array.isArray(res)) {
        //if the selected node is a folder
        const [node, parent] = res;
        if (node.children) {
          const name = nameGenerator(FileOrFolder.Folder, node);
          const {
            data: { nodeId },
          } = await axios.post("/api/note", {
            name,
            belongTo: node.id,
            type: FileOrFolder.Folder,
          });
          newNode = {
            id: nodeId,
            name,
            level: node.level + 1,
            isNew: true,
            children: [],
          };
          const index = findIndexOfFirstFile(node.children);
          node.children.splice(index, 0, newNode);
          if (!expanded.includes(selectedId)) {
            setExpanded([...expanded, selectedId]);
          }
        } else {
          const name = nameGenerator(FileOrFolder.Folder, parent);
          const requestBody: any = {
            name,
            type: FileOrFolder.Folder,
          };
          if (parent.id !== "root") {
            requestBody.belongTo = parent.id;
          }
          const {
            data: { nodeId },
          } = await axios.post("/api/note", requestBody);
          newNode = {
            id: nodeId,
            name,
            level: node.level,
            isNew: true,
            children: [],
          };
          const index = findIndexOfFirstFile(parent.children!);
          parent.children!.splice(index, 0, newNode);
        }
      } else {
        const name = nameGenerator(FileOrFolder.Folder, res);
        const {
          data: { nodeId },
        } = await axios.post("/api/note", {
          name,
          type: FileOrFolder.Folder,
        });
        newNode = {
          id: nodeId,
          name,
          level: res.level + 1,
          isNew: true,
          children: [],
        };
        const index = findIndexOfFirstFile(res.children!);
        res.children!.splice(index, 0, newNode);
      }
      setData({ ...data });
      setFolderIds([...folderIds, newNode.id]);
    } catch (err) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to create the folder. Internal error. Please try later."
      );
    }
  };

  const handleExpandAll = () => {
    setExpanded(folderIds);
  };

  const handleCollapseAll = () => {
    setExpanded([]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        px: 2,
        height: "4vh",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>MY NOTES</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Create New Note" arrow>
          <IconButton
            aria-label="Create New Note"
            size="small"
            sx={{ p: 0.5, color: "black" }}
            onClick={handleCreateNewNote}
          >
            <AiOutlineFileAdd />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create New Folder" arrow>
          <IconButton
            aria-label="Create New Folder"
            size="small"
            sx={{ p: 0.5, color: "black" }}
            onClick={handleCreateNewFolder}
          >
            <BsFolderPlus />
          </IconButton>
        </Tooltip>
        <Tooltip title="Expand All" arrow>
          <IconButton
            aria-label="Expand All"
            size="small"
            sx={{ p: 0.5, color: "black" }}
            onClick={handleExpandAll}
          >
            <GoUnfold />
          </IconButton>
        </Tooltip>
        <Tooltip title="Collapse All" arrow>
          <IconButton
            aria-label="Collapse All"
            size="small"
            sx={{ p: 0.5, color: "black" }}
            onClick={handleCollapseAll}
          >
            <GoFold />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Header;

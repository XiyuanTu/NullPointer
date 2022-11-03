import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import DeleteIcon from "@mui/icons-material/Delete";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import { setSelectedId } from "../../../state/slices/selectedIdSlice";
import {
  isParentOrItself,
  getNodeById,
  isNameTaken,
} from "../../../utils/fileSystem";
import axios from "axios";
import { setNote } from "../../../state/slices/noteSlice";
import { Feedback, NoteInfo, FileOrFolder } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  level: number;
  parentNode: RenderTree;
  nodeObj: RenderTree;
  data: RenderTree;
  setData: React.Dispatch<React.SetStateAction<RenderTree>>;
  folderIds: string[];
  setFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  isNew: boolean;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    width: "auto",
    display: "inline-flex",
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused": {
      backgroundColor: "inherit",
    },
    "&.Mui-focused:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-selected,&.Mui-selected:hover": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 6,
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    labelIcon,
    labelInfo,
    labelText,
    level,
    parentNode,
    nodeObj,
    data,
    setData,
    folderIds,
    setFolderIds,
    isNew,
    ...other
  } = props;

  const [isHovering, setIsHovering] = useState(false);
  const [isRenaming, setIsRenaming] = useState(isNew);

  const [isInputValid, setIsInputValid] = useState(true);
  const [inputHelperText, setInputHelperText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(nodeObj.favorite);
  const [isPublic, setIsPublic] = useState(nodeObj.public);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.selectedId.value);
  const note = useAppSelector((state) => state.note.value);

  const handleDeleteBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleYes = () => {
    setOpenDialog(false);
    handleDelete();
  };

  const handleDelete = async () => {
    feedback(dispatch, Feedback.Info, "Deleting the file/folder...", false)

    try {
      await axios.delete(`http://localhost:3000/api/note/${nodeObj.id}`, {
        data: {
          type:
            nodeObj.children === undefined
              ? FileOrFolder.File
              : FileOrFolder.Folder,
        },
      });
      // when a node is deleted, if the selected node is going to be deleted as well, then its parent node will be selected
      const selectedNode = getNodeById(selectedId, data);
      if (isParentOrItself(nodeObj, selectedNode!)) {
        dispatch(setSelectedId(parentNode.id));
      }

      parentNode.children = parentNode.children!.filter(
        (child) => child.id !== nodeObj.id
      );

      if (nodeObj.children) {
        const newFolderIds = folderIds.filter(
          (folderId) => folderId !== nodeObj.id
        );
        setFolderIds(newFolderIds);
      } else {
        //clear the markdown editor
        dispatch(setNote());
      }

      setData({ ...data });
      feedback(dispatch, Feedback.Success, "Successfully delete the file/folder.")
    } catch (e) {
      feedback(dispatch, Feedback.Error, "Fail to delete. Internal error. Please try later.")
    }
  };

  const handleRename = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value.trim();
    if (inputValue === "") {
      setIsInputValid(false);
      setInputHelperText("Filename or foldername can not be blank!");
      return;
    }

    let existed = isNameTaken(inputValue, nodeObj, parentNode);

    if (existed) {
      setIsInputValid(false);
      setInputHelperText("Filename or foldername has been taken!");
      return;
    }

    setIsInputValid(true);
    setInputHelperText("");
  };

  const handleOnBlur = async () => {
    const inputValue = inputRef.current!.value.trim();
    const justAdded = nodeObj.isNew;
    nodeObj.isNew = false;

    if (isInputValid) {
      if (!justAdded) {
        feedback(dispatch, Feedback.Info, "Updating the filename/foldername...", false)
      }

      try {
        await axios.patch(`http://localhost:3000/api/note/${nodeObj.id}`, {
          property: NoteInfo.Name,
          value: { ...nodeObj, name: inputValue },
        });
        nodeObj.name = inputValue;
        setData({ ...data }); //setData(data) won't make React rerender!

        //the filename in info component can update immediately
        if (!nodeObj.children) {
          dispatch(setNote({...note!, name: inputValue}))
        }
        
        if (!justAdded) {
          feedback(dispatch, Feedback.Success, "Updating the filename/foldername...")
        }
      } catch (e) {
        if (!justAdded) {
          feedback(dispatch, Feedback.Error, "Fail to rename. Internal error. Please try later.")
        }
      }
    }
    setIsRenaming(false);
    setIsInputValid(true);
    setInputHelperText("");
  };

  const handleFavoriteBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    /* otherwise if the user set it to 'favorite' and then turn to the userinfo page, 
    when they come back to this page, they will see it's still not favorite */
    nodeObj.favorite = !isFavorite
    await handleToggleAction(NoteInfo.Favorite, { favorite: !isFavorite }, setIsFavorite) 
  };

  const handlePublicBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const value: {public: boolean, firstPublicAt?: Date | null} = { public: !isPublic}
    if (!nodeObj.firstPublicAt) {
      value.firstPublicAt = new Date()
    }

    /* otherwise if the user set it to 'public' and then turn to the userinfo page, 
    when they come back to this page, they will see it's still private */
    nodeObj.public = !isPublic
    await handleToggleAction(NoteInfo.Public, value, setIsPublic)
  };

  const handleToggleAction = async(property: NoteInfo, value: {}, setState: React.Dispatch<React.SetStateAction<boolean | undefined>>)  => {
    try {
      await axios.patch(`http://localhost:3000/api/note/${nodeObj.id}`, {
        property,
        value
      });

      setState((state) => !state);
    } catch (error) {
      feedback(dispatch, Feedback.Error, "Fail to update. Internal error. Please try later.")
    }
  }

  const actions = [
    {
      name: "Rename",
      icon: <DriveFileRenameOutlineOutlinedIcon sx={{ fontSize: 15 }} />,
      onClick: handleRename,
    },
    {
      name: "Delete",
      icon: <DeleteIcon sx={{ fontSize: 15 }} />,
      onClick: handleDeleteBtn,
    },
    {
      name: "Favorite",
      icon: isFavorite ? (
        <StarIcon sx={{ fontSize: 15 }} />
      ) : (
        <StarOutlineIcon sx={{ fontSize: 15 }} />
      ),
      onClick: handleFavoriteBtn,
      type: FileOrFolder.File,
    },
    {
      name: isPublic ? "Public" : "Private",
      icon: isPublic ? (
        <LockOpenOutlinedIcon sx={{ fontSize: 15 }} />
      ) : (
        <LockOutlinedIcon sx={{ fontSize: 15 }} />
      ),
      onClick: handlePublicBtn,
      type: FileOrFolder.File,
    }
  ];

  return (
    <>
      <StyledTreeItemRoot
        label={
          <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
            <Box component={labelIcon} color="inherit" sx={{ mr: 1 }} />
            {isRenaming ? (
              <TextField
                hiddenLabel
                id="file-name"
                defaultValue={labelText}
                sx={{ "& .MuiInputBase-input": { p: 0, pl: 1 } }}
                onBlur={handleOnBlur}
                onClick={(e) => e.stopPropagation()}
                onChange={handleChange}
                autoFocus
                inputRef={inputRef}
                error={!isInputValid}
                helperText={inputHelperText}
                autoComplete={"off"}
              />
            ) : (
              // <Box sx={{width: 50}}>

              <Typography noWrap={true} variant="body2" sx={{ fontWeight: "inherit", mr: 5,  maxWidth: '30vw'}}>
                {labelText}
              </Typography>
              // </Box>
            )}

            {isHovering &&
              actions.map((action) => {
                if (nodeObj.children && action.type) {
                  return;
                }

                return (
                  <Tooltip key={action.name} title={action.name} arrow>
                    <IconButton
                      aria-label={action.name}
                      size="small"
                      sx={{ p: 0.5, color: "inherit" }}
                      onClick={action.onClick}
                    >
                      {action.icon}
                    </IconButton>
                  </Tooltip>
                );
              })}
          </Box>
        }
        style={{
          "--tree-view-color": "#1a73e8",
          "--tree-view-bg-color": "#e8f0fe",
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setIsHovering(true);
        }}
        onMouseOut={() => {
          setIsHovering(false);
        }}
        {...other}
        nodeId={nodeObj.id}
      />
      <Dialog open={openDialog} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete
          <Typography noWrap={true} >
            {nodeObj.name}?
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleYes} autoFocus>
            Yes
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StyledTreeItem;

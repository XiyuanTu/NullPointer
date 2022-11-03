import { useState, useEffect, useRef } from "react";
import {
  Box,
  Divider,
  Typography,
  IconButton,
  Chip,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import InfoItem from "./InfoItem";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PublicIcon from "@mui/icons-material/Public";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Feedback, NoteInfo } from "../../../types/constants";
import axios from "axios";
import { setNote } from "../../../state/slices/noteSlice";
import { showFeedback } from "../../../state/slices/feedbackSlice";
import { feedback } from "../../../utils/feedback";

const NoteInfoComponent = () => {
  const note = useAppSelector((state) => state.note.value);
  const createdAt = new Date(note!.createdAt).toLocaleString();
  const lastModified = new Date(note!.lastModified).toLocaleString();
  const firstPublicAt = new Date(note!.firstPublicAt).toLocaleString();

  return (
    <Box
      sx={{ display: "flex", flexFlow: "column", height: "91vh", pt: 2, pl: 1 }}
    >
      <Typography
        align="center"
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Info
      </Typography>

      <InfoItem
        icon={InsertDriveFileOutlinedIcon}
        label="Filename"
        info={note!.name}
      />
      <InfoItem
        icon={CalendarMonthOutlinedIcon}
        label="Created"
        info={createdAt}
      />
      <InfoItem icon={EditIcon} label="Last Modified" info={lastModified} />
      {note!.firstPublicAt && (
        <InfoItem
          icon={PublicIcon}
          label="Public First Time"
          info={firstPublicAt}
        />
      )}

      <Divider
        orientation="horizontal"
        sx={{ height: "1vh", mb: 2, color: "black" }}
      />

      <Tags note={note!} />

    </Box>
  );
};

export default NoteInfoComponent;

interface IProps {
  note: Note;
}

const Tags = ({ note }: IProps) => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(note.tags);
  const [tagSet, setTagSet] = useState(new Set(note.tags));

  const handleDelete = (tag: string) => () => {
    setTags((tags) => tags.filter((element) => element !== tag));

    tagSet.delete(tag);
  };

  const handleOnBlur = () => {
    setIsAdding(false);
    const tag = newTag.toLowerCase().trim();

    if (tag !== "" && !tagSet.has(tag)) {
      setTags([...tags, tag]);
      tagSet.add(tag);
    }

    setNewTag("");
  };

  useEffect(() => {
    return () => {
      (async () => {
        await axios.patch(`http://localhost:3000/api/note/${note._id}`, {
          property: NoteInfo.Tags,
          value: { tags },
        });
      })();
      dispatch(setNote({ ...note, tags }));
    };
  }, [tags]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "flex-start",
        flex: 1,
        p: 0.5,
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: 8,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
          borderRadius: 5,
          // outline: '1px solid slategrey',
          "&:hover": {
            backgroundColor: "#F8F8FF",
          },
          "&:active": {
            backgroundColor: "#4682B4",
          },
        },
      }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          onDelete={handleDelete(tag)}
          sx={{ m: 0.5 }}
        />
      ))}

      {isAdding ? (
        <TextField
          autoFocus
          placeholder="New Tag"
          onBlur={handleOnBlur}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ width: 100, m: 0.5, "& .MuiInputBase-root": { height: 30 } }}
        />
      ) : (
        <IconButton
          aria-label="add"
          sx={{ border: "1px solid grey", p: 0.3 }}
          onClick={() => setIsAdding(true)}
        >
          <AddRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
};

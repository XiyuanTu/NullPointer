import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, InputBase } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import axios from "axios";
import { showFeedback, closeFeedback } from "../state/slices/feedbackSlice";
import { Feedback, NoteInfo } from "../types/constants";
import { feedback } from "../utils/feedback";

const Title = () => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => state.note.value);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(note!.title);

  useEffect(() => {
    note && setTitle(note.title);
  }, [note]);

  const handleOnClick = () => {
    setIsUpdating(true);
  };

  const handleOnBlur = async () => {
    setIsUpdating(false);

    try {
      await axios.patch(`http://localhost:3000/api/note/${note!._id}`, {
        property: NoteInfo.Title,
        value: { title: title.trim() },
      });
    } catch (e) {
      feedback(dispatch, Feedback.Error, "Fail to update the title in the database. Internal error. Please try later...")
    }
  };

  return (
    <Box
      sx={{
        height: "6vh",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {isUpdating ? (
        <InputBase
          value={title}
          autoFocus={true}
          multiline={true}
          maxRows="2"
          sx={{
            width: "90%",
            fontWeight: "bold",
            "& .MuiInputBase-input": { textAlign: "center" },
          }}
          onBlur={handleOnBlur}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : title ? (
        <Typography
          noWrap={true}
          align="center"
          sx={{
            height: "inherit",
            width: "90%",
            fontSize: "1rem",
            fontWeight: "bold",
            overflowY: "auto",
            lineHeight: "6vh",
            m: 0,
          }}
          onClick={handleOnClick}
        >
          {title}
        </Typography>
      ) : (
        <Typography
          sx={{ color: "#AAAAAA", fontSize: 25, fontWeight: "bold" }}
          onClick={handleOnClick}
        >
          Title
        </Typography>
      )}
    </Box>
  );
};

export default Title;

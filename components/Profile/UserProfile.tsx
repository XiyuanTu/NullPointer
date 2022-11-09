import {
  Box,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../../state/hooks";
import { Feedback, UserInfo } from "../../types/constants";
import { feedback } from "../../utils/feedback";
import UserAvatar from "../UserAvatar";

interface IProps {
  user: User;
}

const UserProfile = ({ user }: IProps) => {
  const { _id: userId } = user;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [description, setDescription] = useState(user.description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleCreateNote = useCallback(() => {
    router.push("/notes");
  }, []);

  const handleEditBtn = useCallback(() => {
    setIsEditingDescription((state) => !state);
  }, []);

  const handleOnBlur = useCallback(async () => {
    setIsEditingDescription((state) => !state);
    try {
      const newDescription = inputRef.current!.value.trim();
      await axios.patch(`http://localhost:3000/api/user/${userId}`, {
        property: UserInfo.Description,
        value: { description: newDescription },
      });
      setDescription(newDescription);
    } catch (err) {
      feedback(
        dispatch,
        Feedback.Error,
        `Fail to update the user description. Internal error. Please try later.`
      );
    }
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "white",
          pt: 5,
        }}
      >
        {/* user avatar */}
        <UserAvatar
          name={user.username}
          image={user.avatar}
          sx={{ width: 120, height: 120, mb: 3 }}
        />
        {/* username  */}
        <Typography
          sx={{
            fontFamily: "inherit",
            fontWeight: "bold",
            fontSize: 27,
            mb: 1,
          }}
        >
          {user.username}
        </Typography>
      </Box>
      <Box sx={{ bgcolor: "white", px: 3, display: 'flex', justifyContent: 'center' }}>
        {/* user description */}
        {isEditingDescription ? (
          <TextField
            inputRef={inputRef}
            autoFocus
            fullWidth
            minRows={3}
            multiline
            defaultValue={description}
            onBlur={handleOnBlur}
            sx={{
              "& .MuiInputBase-root": { borderRadius: 0, py: 1, pl: 2 },
            }}
          />
        ) : description ? (
          <Typography
            variant="body2"
            sx={{
              width: "inherit",
              fontFamily: "inherit",
              color: "gray",
              wordBreak: "break-word",
            }}
          >
            {description}
            <Tooltip title="Edit" arrow>
              <IconButton
                aria-label="Edit"
                size="small"
                sx={{ p: 0.5, color: "gray" }}
                onClick={handleEditBtn}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily: "inherit",
              color: "gray",
              "&:hover": { cursor: "pointer", textDecoration: "underline" },
            }}
            onClick={handleEditBtn}
          >
            Write a description about yourself
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Button
          sx={{
            bgcolor: "#ffffff",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#ffffff",
              "& > *": {
                color: "#2a8ff4",
              },
            },
          }}
        >
          <Typography sx={{ fontFamily: "inherit", color: "#8590a6" }}>
            Followers
          </Typography>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
            }}
          >
            {user.followers.length}
          </Typography>
        </Button>
        <Button
          sx={{
            bgcolor: "#ffffff",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#ffffff",
              "& > *": {
                color: "#2a8ff4",
              },
            },
          }}
        >
          <Typography sx={{ fontFamily: "inherit", color: "#8590a6" }}>
            Following
          </Typography>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
            }}
          >
            {user.following.length}
          </Typography>
        </Button>
      </Box>
      <Button
        variant="outlined"
        sx={{ textTransform: "none", width: "100%", mt: 1, bgcolor: "#fff" }}
        onClick={handleCreateNote}
      >
        Create Note
      </Button>
    </Box>
  );
};

export default UserProfile;

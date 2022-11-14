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
import { useCallback, useRef, useState, useEffect } from "react";
import { useAppDispatch } from "../../state/hooks";
import { Feedback, UserInfo } from "../../types/constants";
import { feedback } from "../../utils/feedback";
import UserAvatar from "../UserAvatar";
import { PhotoCamera } from "@mui/icons-material";
import { useSession } from "next-auth/react";


interface IProps {
  user: User;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
}

const UserProfile = ({ user, setTabValue }: IProps) => {
  const { _id: userId } = user;
  const dispatch = useAppDispatch();
  const router = useRouter();
 
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [description, setDescription] = useState(user.description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.avatar);

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
      await axios.patch(`/api/user/${userId}`, {
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

  const handleFollowingBtn = useCallback(() => {
    setTabValue(5);
  }, []);

  const handleFollowersBtn = useCallback(() => {
    setTabValue(4);
  }, []);

  const handleOnMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      setIsHoveringAvatar(true);
    },
    []
  );

  const handleOnMouseOut = useCallback(() => {
    setIsHoveringAvatar(false);
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData();
      formData.append("file", e.target.files!["0"]);
      formData.append("upload_preset", "nullpointer");
      try {
        const {
          data: { url },
        } = await axios.post(
          "https://api.cloudinary.com/v1_1/dfk7ged9a/image/upload",
          formData
        );
        await axios.patch(`/api/user/${userId}`, {
          property: UserInfo.Avatar,
          value: { avatar: url },
        });
        setImageUrl(url);

      } catch (e) {
        feedback(
          dispatch,
          Feedback.Error,
          `Fail to update the avatar. Internal error. Please try later.`
        );
      }
    },
    []
  );

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
        <Box
          onMouseOver={handleOnMouseOver}
          onMouseOut={handleOnMouseOut}
          sx={{ mb: 3, position: "relative" }}
        >
          <UserAvatar
            name={user.username}
            image={imageUrl}
            sx={{
              width: 120,
              height: 120,
              opacity: isHoveringAvatar ? 0.5 : 1,
            }}
          />
          {isHoveringAvatar && (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 20,
              }}
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
              <PhotoCamera fontSize="large" />
            </IconButton>
          )}
        </Box>

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
      <Box
        sx={{
          bgcolor: "white",
          px: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
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
          onClick={handleFollowersBtn}
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
          onClick={handleFollowingBtn}
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

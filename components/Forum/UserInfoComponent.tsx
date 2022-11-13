import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Divider,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CardHeader,
  Avatar,
  ButtonBase,
} from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarIcon from "@mui/icons-material/Star";

import { useRouter } from "next/router";
import axios from "axios";
import { Action, Feedback, UserInfo } from "../../types/constants";
import { feedback } from "../../utils/feedback";
import { useAppDispatch } from "../../state/hooks";

const listButtons = [
  {
    icon: <DescriptionIcon />,
    text: "Notes",
  },
  {
    icon: <FavoriteIcon />,
    text: "Likes",
  },
  {
    icon: <BookmarkIcon />,
    text: "Bookmarks",
  },
  {
    icon: <StarIcon />,
    text: "Favorite",
  },
];

const info = ["Contact Me", "FAQs", "Source Code", "Terms and Privacy"];

interface IProps {
  user: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  whoToFollow: User[];
}

const UserInfoComponent = ({
  user,
  setCurrentUser,
  whoToFollow,
}: IProps) => {
  const router = useRouter();

  const handleNavigateToProfile = useCallback((tabValue: number) => {
    router.push({ pathname: "/profile", query: { tabValue } });
  }, []);

  const handleCreateNote = useCallback(() => {
    router.push("/notes");
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#fff",
          flexDirection: "column",
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "inherit",
            fontWeight: "bold",
            fontSize: 20,
            m: 2,
            mb: 0,
          }}
        >
          Who to follow
        </Typography>
        {whoToFollow.map((recommendedUser, index) => (
          <UserCard
            key={index}
            user={user}
            recommendedUser={recommendedUser}
            setCurrentUser={setCurrentUser}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", mt: 1 }}>
        <Button
          onClick={() => handleNavigateToProfile(4)}
          sx={{
            bgcolor: "#ffffff",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            mr: 0.5,
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
          onClick={() => handleNavigateToProfile(5)}
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

      <Box sx={{ bgcolor: "#fff", mt: 1 }}>
        <List>
          {listButtons.map((listButtons, index) => (
            <ListItem key={listButtons.text} disablePadding>
              <ListItemButton onClick={() => handleNavigateToProfile(index)}>
                <ListItemIcon>{listButtons.icon}</ListItemIcon>
                <ListItemText
                  sx={{ fontFamily: "inherit", color: "#8590a6" }}
                  primary={listButtons.text}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        {info.map((info, index) => (
          <ButtonBase
            key={index}
            sx={{
              mr: 2,
              fontFamily: "inherit",
              color: "#8590a6",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {info}
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
};

export default UserInfoComponent;

interface UserCardIProps {
  recommendedUser: User;
  user: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserCard = ({
  recommendedUser,
  user,
  setCurrentUser,
}: UserCardIProps) => {

  const [isFollowing, setIsFollowing] = useState(
    user.following.includes(recommendedUser._id)
  );

  const dispatch = useAppDispatch();

  const handleFollowAndFollowing = useCallback(async () => {
    try {
      await axios.patch(`http://localhost:3000/api/user/${user._id}`, {
        property: UserInfo.Following,
        action: isFollowing ? Action.Pull : Action.Push,
        value: { following: recommendedUser._id },
      });
      await axios.patch(
        `http://localhost:3000/api/user/${recommendedUser._id}`,
        {
          property: UserInfo.Followers,
          action: isFollowing ? Action.Pull : Action.Push,
          value: { followers: user._id },
        }
      );

      let newFollowing;
      newFollowing = isFollowing
        ? user.following.filter((id) => id !== recommendedUser._id)
        : [...user.following, recommendedUser._id];
      setCurrentUser({ ...user, following: newFollowing });
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to process. Internal error. Please try later."
      );
    }
  }, [isFollowing]);

  useEffect(() => {
    setIsFollowing(user.following.includes(recommendedUser._id));
  }, [user.following]);

  return (
    <CardHeader
      avatar={
        recommendedUser.avatar ? (
          <Avatar src={recommendedUser.avatar} aria-label="username" />
        ) : (
          <Avatar src={recommendedUser.avatar} aria-label="username">
            {recommendedUser.username.substring(0, 1).toUpperCase()}
          </Avatar>
        )
      }
      title={
        <Typography
          variant="body2"
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontFamily: "inherit",
            wordBreak: "break-word",
          }}
          component="span"
        >
          {recommendedUser.username}
        </Typography>
      }
      subheader={
        <Typography
          variant="body2"
          sx={{ fontFamily: "inherit", color: "gray", wordBreak: "break-word" }}
        >
          {recommendedUser.description}
        </Typography>
      }
      action={
        <Button
          variant="text"
          sx={{ textTransform: "none" }}
          onClick={handleFollowAndFollowing}
        >
          {isFollowing ? "Following" : "+ Follow"}
        </Button>
      }
      sx={{
        pb: 0,
        "& .MuiCardHeader-title": {
          fontWeight: "bold",
          fontFamily: "inherit",
        },
      }}
    />
  );
};

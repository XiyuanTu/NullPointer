import { useState, useRef, useEffect } from "react";
import Link from 'next/link'
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
    icon: <ChatBubbleIcon />,
    text: "Comments",
  },
];

const recommendedUsers = [
  {
    username: "John",
    description: "full stack",
  },
  {
    username: "Tina",
    description: "athlete",
  },
  {
    username: "Tina",
    description: "athlete",
  },
  {
    username: "Tina",
    description: "athlete",
  },
  {
    username: "Tina",
    description: "athlete",
  },
  {
    username: "Tina",
    description: "athlete",
  },
];

const info = ["Contact Me", "FAQs", "Source Code", "Terms and Privacy"];

const UserInfo = () => {


  return (
    <Box sx={{ position: "sticky", top: "-200px" }}>
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
        {recommendedUsers.map((recommendedUser, index) => (
          <UserCard key={index} user={recommendedUser} />
        ))}
      </Box>

      <Box sx={{ display: "flex", mt: 1 }}>
        <Button
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
            10
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
            12
          </Typography>
        </Button>
      </Box>

      <Button
        variant="outlined"
        sx={{ textTransform: "none", width: "100%", mt: 1, bgcolor: "#fff" }}
      >
        <Link href='/notes'>Create Note</Link> 
      </Button>

      <Box sx={{ bgcolor: "#fff", mt: 1 }}>
        <List>
          {listButtons.map((listButtons) => (
            <ListItem key={listButtons.text} disablePadding>
              <ListItemButton>
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

export default UserInfo;

interface UserCardIProps {
  user: {
    username: string;
    avatar?: string;
    description?: string;
  };
}

const UserCard = ({ user }: UserCardIProps) => {
  return (
    <CardHeader
      avatar={
        user.avatar ? (
          <Avatar src={user.avatar} aria-label="username" />
        ) : (
          <Avatar src={user.avatar} aria-label="username">
            {user.username.substring(0, 1).toUpperCase()}
          </Avatar>
        )
      }
      title={
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", fontFamily: "inherit" }}
          component="span"
        >
          {user.username}
        </Typography>
      }
      subheader={
        <Typography
          variant="body2"
          sx={{ fontFamily: "inherit", color: "gray" }}
        >
          {user.description}
        </Typography>
      }
      action={
        <Button variant="text" sx={{ textTransform: "none" }}>
          + Follow
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

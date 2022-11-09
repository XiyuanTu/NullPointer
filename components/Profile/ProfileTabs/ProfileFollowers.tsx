import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { Action, Feedback, UserInfo } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";
import { convertCount } from "../../../utils/forum";
import UserAvatar from "../../UserAvatar";
import ContentItem from "./ContentItem";

interface IProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const ProfileFollowers = ({ user, setUser }: IProps) => {
  const { _id: userId } = user;
  const [followers, setFollowers] = useState<User[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch()

  const handlePageOnChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    },
    []
  );

  const handleFollowAndFollowing = useCallback(async(followerId: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/user/${userId}`, {
        property: UserInfo.Following,
        action: user.following.includes(followerId) ? Action.Pull : Action.Push,
        value: { following: followerId },
      });
      await axios.patch(`http://localhost:3000/api/user/${followerId}`, {
        property: UserInfo.Followers,
        action: user.following.includes(followerId) ? Action.Pull : Action.Push,
        value: { followers: userId },
      });
      const target = followers!.find(follower => follower._id === followerId)
      let newFollowing = []
      if (user.following.includes(followerId)) {
        newFollowing = user.following.filter(followingId => followingId !== followerId)
        target!.followers = target!.followers.filter(followerId => followerId !== userId)
      } else {
        newFollowing = [...user.following, followerId]
        target!.followers = [...target!.followers, userId]
      }
      setUser({ ...user, following: newFollowing});
      setFollowers(state => [...state!])
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to process. Internal error. Please try later."
      );
    }
    }, [followers, user]);

  useEffect(() => {
    (async function getNotes() {
      const {
        data: { users },
      } = await axios.get("http://localhost:3000/api/users", {
        params: { value: user.followers },
      });
      setFollowers(users);
    })();
  }, []);

  if (!followers) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (followers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          pt: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "inherit",
            fontWeight: "bold",
            mb: 2,
            fontSize: 20,
          }}
        >
          You do not have any follower yet!
        </Typography>
        <Image src="/no_data.jpg" width={900} height={500} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1.5,
          position: "sticky",
          top: 112,
          bgcolor: "rgb(241, 242, 242)",
          zIndex: 99,
        }}
      >
        <Typography>
          {(currentPage - 1) * 8 + 1} -{" "}
          {Math.min(currentPage * 8, followers.length)} of {followers.length}{" "}
          followers
        </Typography>
      </Box>
      <List sx={{ bgcolor: "transparent", minHeight: 400 }}>
        {followers.map((follower, index) => {
          if (
            index >= (currentPage - 1) * 8 &&
            index < Math.min(currentPage * 8, followers.length)
          ) {
            return (
              <ListItem key={follower._id} alignItems="center" sx={{bgcolor: 'white'}}>
                <ListItemAvatar>
                  <UserAvatar
                    name={follower.username}
                    image={follower.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component='span' sx={{fontFamily: 'inherit', fontWeight: 'bold'}}>{follower.username}</Typography>
                  }
                  secondary={`${convertCount(follower.followers.length)} ${follower.followers.length === 1 ? 'follower': 'followers'}`}
                />
                <Button
                  variant="contained"
                  sx={{
                    // width: "50%",
                    fontFamily: "inherit",
                    fontSize: 13,
                    textTransform: "none",
                  }}
                  onClick={() => handleFollowAndFollowing(follower._id)}
                >
                  {user.following.includes(follower._id) ? 'Following' : 'Follow'}
                </Button>
              </ListItem>
            );
          }
        })}
      </List>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Pagination
          count={Math.ceil(followers.length / 8)}
          color="primary"
          page={currentPage}
          onChange={handlePageOnChange}
        />
      </Box>
    </Box>
  );
};

export default ProfileFollowers;

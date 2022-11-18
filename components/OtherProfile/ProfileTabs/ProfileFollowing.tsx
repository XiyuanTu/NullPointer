import {
  Box,
  Pagination,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  ButtonBase,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { Action, Feedback, UserInfo } from "../../../types/constants";
import { feedback } from "../../../utils/feedback";
import { convertCount } from "../../../utils/note";
import UserAvatar from "../../UserAvatar";

interface IProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  otherUser: User;
}

const ProfileFollowing = ({ user, setUser, otherUser }: IProps) => {
  const { _id: userId } = user;
  const router = useRouter();
  const [following, setFollowing] = useState<User[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFollowBtnDisabled, setIsFollowBtnDisabled] = useState(false);
  const [isToProfileBtnDisabled, setIsToProfileBtnDisabled] = useState(false);
  const dispatch = useAppDispatch();

  const handlePageOnChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    },
    []
  );

  const handleToProfile = useCallback(async (followingUserId: string) => {
    setIsToProfileBtnDisabled(true);
    if (followingUserId === userId) {
      await router.push("/profile");
    } else {
      await router.push("/profile/" + followingUserId);
    }
    setIsToProfileBtnDisabled(false);
  }, []);

  const handleFollowAndFollowing = useCallback(
    async (followingUserId: string) => {
      setIsFollowBtnDisabled(true);
      try {
        await axios.patch(`/api/user/${userId}`, {
          property: UserInfo.Following,
          action: user.following.includes(followingUserId)
            ? Action.Pull
            : Action.Push,
          value: { following: followingUserId },
        });
        await axios.patch(`/api/user/${followingUserId}`, {
          property: UserInfo.Followers,
          action: user.following.includes(followingUserId)
            ? Action.Pull
            : Action.Push,
          value: { followers: userId },
        });
        const target = following!.find(
          (followingUser) => followingUser._id === followingUserId
        );
        let newFollowing = [];
        if (user.following.includes(followingUserId)) {
          newFollowing = user.following.filter(
            (followingId) => followingId !== followingUserId
          );
          target!.followers = target!.followers.filter(
            (followerId) => followerId !== userId
          );
        } else {
          newFollowing = [...user.following, followingUserId];
          target!.followers = [...target!.followers, userId];
        }
        setUser({ ...user, following: newFollowing });
        setFollowing((state) => [...state!]);
      } catch (e) {
        feedback(
          dispatch,
          Feedback.Error,
          "Fail to process. Internal error. Please try later."
        );
      }
      setIsFollowBtnDisabled(false);
    },
    [following, user]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    (async function getNotes() {
      const {
        data: { users },
      } = await axios.get("/api/users", {
        params: { value: otherUser.following },
      });
      setFollowing(users);
    })();
  }, []);

  if (!following) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (following.length === 0) {
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
          You are not following anyone!
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
          {Math.min(currentPage * 8, following.length)} of {following.length}{" "}
          users
        </Typography>
      </Box>
      <List sx={{ bgcolor: "transparent", minHeight: 400 }}>
        {following.map((followingUser, index) => {
          if (
            index >= (currentPage - 1) * 8 &&
            index < Math.min(currentPage * 8, following.length)
          ) {
            return (
              <ListItem
                key={followingUser._id}
                alignItems="center"
                sx={{ bgcolor: "white" }}
              >
                <ListItemAvatar>
                  <ButtonBase
                    disabled={isToProfileBtnDisabled}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={() => handleToProfile(followingUser._id)}
                  >
                    <UserAvatar
                      name={followingUser.username}
                      image={followingUser.avatar}
                    />
                  </ButtonBase>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <ButtonBase
                      disabled={isToProfileBtnDisabled}
                      onClick={() => handleToProfile(followingUser._id)}
                      sx={{
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        fontWeight: "bold",
                        "&:hover": { cursor: "pointer" },
                      }}
                    >
                      {followingUser.username}
                    </ButtonBase>
                  }
                  secondary={`${convertCount(followingUser.followers.length)} ${
                    followingUser.followers.length === 1
                      ? "follower"
                      : "followers"
                  }`}
                />
                <Button
                  variant="contained"
                  disabled={userId === followingUser._id || isFollowBtnDisabled}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: 13,
                    textTransform: "none",
                  }}
                  onClick={() => handleFollowAndFollowing(followingUser._id)}
                >
                  {userId === followingUser._id
                    ? "Yourself"
                    : user.following.includes(followingUser._id)
                    ? "Following"
                    : "Follow"}
                </Button>
              </ListItem>
            );
          }
        })}
      </List>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Pagination
          count={Math.ceil(following.length / 8)}
          color="primary"
          page={currentPage}
          onChange={handlePageOnChange}
        />
      </Box>
    </Box>
  );
};

export default ProfileFollowing;

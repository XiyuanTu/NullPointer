import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useCallback } from "react";
import { useAppDispatch } from "../../state/hooks";
import { Action, Feedback, UserInfo } from "../../types/constants";
import { feedback } from "../../utils/feedback";
import UserAvatar from "../UserAvatar";

interface IProps {
  user: User;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  otherUser: User;
  setOtherUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserProfile = ({
  user,
  setTabValue,
  otherUser,
  setOtherUser,
}: IProps) => {
  const { _id: userId } = user;
  const { _id: otherUserId } = otherUser;
  const dispatch = useAppDispatch();

  const handleFollowAndFollowing = useCallback(async () => {
    try {
      await axios.patch(`/api/user/${userId}`, {
        property: UserInfo.Following,
        action: otherUser.followers.includes(userId)
          ? Action.Pull
          : Action.Push,
        value: { following: otherUserId },
      });
      await axios.patch(`/api/user/${otherUserId}`, {
        property: UserInfo.Followers,
        action: otherUser.followers.includes(userId)
          ? Action.Pull
          : Action.Push,
        value: { followers: userId },
      });

      let newFollowers = [];
      if (otherUser.followers.includes(userId)) {
        newFollowers = otherUser.followers.filter(
          (followerId) => followerId !== userId
        );
      } else {
        newFollowers = [...otherUser.followers, userId];
      }
      setOtherUser({ ...otherUser, followers: newFollowers });
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to process. Internal error. Please try later."
      );
    }
  }, [user, otherUser]);

  const handleFollowingBtn = useCallback(() => {
    setTabValue(2);
  }, []);

  const handleFollowersBtn = useCallback(() => {
    setTabValue(1);
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
          name={otherUser.username}
          image={otherUser.avatar}
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
          {otherUser.username}
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
        {otherUser.description && (
          <Typography
            variant="body2"
            sx={{
              width: "inherit",
              fontFamily: "inherit",
              color: "gray",
              wordBreak: "break-word",
            }}
          >
            {otherUser.description}
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
            {otherUser.followers.length}
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
            {otherUser.following.length}
          </Typography>
        </Button>
      </Box>
      <Button
        variant="outlined"
        sx={{ textTransform: "none", width: "100%", mt: 1, bgcolor: "#fff" }}
        onClick={handleFollowAndFollowing}
      >
        {otherUser.followers.includes(userId) ? "Following" : "Follow"}
      </Button>
    </Box>
  );
};

export default UserProfile;

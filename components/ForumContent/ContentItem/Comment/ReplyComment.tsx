import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../../state/hooks";
import { Action, CommentInfo, Feedback } from "../../../../types/constants";
import { feedback } from "../../../../utils/feedback";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Button,
  Tooltip,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { convertDate } from "../../../../utils/forum";
import UserAvatar from "../../../UserAvatar";

interface IProps {
  comment: ConvertedComment;
  noteAuthorId: string;
  setNewReplies: React.Dispatch<React.SetStateAction<ConvertedComment[]>>;
  user: User;
  noteId: string;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

const ReplyComment = ({
  comment,
  noteAuthorId,
  setNewReplies,
  user,
  noteId,
  setCommentCount,
}: IProps) => {
  const dispatch = useAppDispatch();

  const [isDeleted, setIsDeleted] = useState(comment.deletedAt !== null);
  const [deletedAt, setDeletedAt] = useState(comment.deletedAt);
  const [author, setAuthor] = useState<User | null>(null);
  const [replyTo, setReplyTo] = useState<User | null>(null);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [isLike, setIsLike] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMore = Boolean(anchorEl);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleStartReply = useCallback(() => {
    setIsReplying(true);
  }, []);

  const handleReplyContentOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReplyContent(e.target.value);
    },
    []
  );

  const handleAddReply = useCallback(async () => {
    try {
      const {
        data: { returnValue },
      } = await axios.post("http://localhost:3000/api/comment", {
        noteId,
        to: comment._id,
        userId: user._id,
        content: replyContent.trim(),
      });
      delete returnValue["__v"];
      returnValue.to = comment._id;
      setNewReplies((state) => [returnValue, ...state]);
      setReplyContent("");
      setIsReplying(false);
      setCommentCount((state) => state + 1);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to add the reply. Internal error. Please try later."
      );
    }
  }, [user, replyContent]);

  const handleReplyContentOnBlur = useCallback(() => {
    if (replyContent.trim() === "") {
      setIsReplying(false);
    }
  }, [replyContent]);

  const handleLike = useCallback(async () => {
    try {
      await axios.patch(`http://localhost:3000/api/comment/${comment._id}`, {
        property: CommentInfo.Likes,
        action: isLike ? Action.Pull : Action.Push,
        value: { likes: author!._id },
      });
      setLikeCount((state) => (isLike ? state - 1 : state + 1));
      setIsLike(!isLike);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to like the comment. Internal error. Please try later."
      );
    }
  }, [isLike, comment._id, author]);

  const handleDelete = useCallback(() => {
    setOpenDeleteDialog(true);
    handleCloseMore();
  }, []);

  const handleCancelDelete = useCallback(async () => {
    setOpenDeleteDialog(false);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    setOpenDeleteDialog(false);
    try {
      if (isDeleted) {
        await axios.patch(`http://localhost:3000/api/comment/${comment._id}`, {
          property: CommentInfo.DeletedAt,
        });
      } else {
        const {
          data: { returnValue },
        } = await axios.delete(
          `http://localhost:3000/api/comment/${comment._id}`
        );
        setDeletedAt(returnValue);
      }
      setIsDeleted((state) => !state);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        `Fail to ${
          isDeleted ? "undelete" : "delete"
        } the comment. Internal error. Please try later.`
      );
    }
  }, [isDeleted, comment]);

  const handleOpenMore = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleCloseMore = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user: author },
        } = await axios.get(`http://localhost:3000/api/user/${comment.userId}`);
        setAuthor(author);

        if (comment.to) {
          const {
            data: { comment: replyToComment },
          } = await axios.get(
            `http://localhost:3000/api/comment/${comment.to}`
          );
          const {
            data: { user: replyTo },
          } = await axios.get(
            `http://localhost:3000/api/user/${replyToComment.userId}`
          );
          setReplyTo(replyTo);
        }
      } catch (err) {
        feedback(
          dispatch,
          Feedback.Error,
          "Fail to retrieve user info. Internal error. Please try later."
        );
      }
    })();
  }, []);

  useEffect(() => {
    author && setIsLike(comment.likes.includes(author._id));
  }, [author]);

  if (!author) {
    return <></>;
  }

  return (
    <>
      {/* delete prompt */}
      {isDeleted && author._id === user._id && (
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#cb4b10",
            fontFamily: "inherit",
            fontWeight: "bold",
            bgcolor: "#fbf1ec",
            p: 2,
          }}
        >
          <WarningAmberIcon sx={{ mr: 1 }} />
          This content has been deleted and is only visible to you.
        </Typography>
      )}
      <ListItem alignItems="flex-start" sx={{ pl: 2, py: 0 }}>
        {/* user avatar */}
        <ListItemAvatar>
          <UserAvatar name={author.username} image={author.avatar} />
        </ListItemAvatar>

        {/* username, created time, label and content */}
        <Box sx={{ flex: 1 }}>
          <ListItemText
            sx={{ "&.MuiListItemText-root": { mb: 0 } }}
            primary={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: "bold",
                    fontSize: 13,
                  }}
                >
                  {author.username}&nbsp;
                </Typography>
                <Typography
                  component="span"
                  sx={{ fontFamily: "inherit", color: "gray", fontSize: 13 }}
                >
                  · {convertDate(comment.createdAt)}
                </Typography>
                {(author._id === user._id || author._id === noteAuthorId) && (
                  <Chip
                    label={author._id === noteAuthorId ? "Author" : "Yourself"}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
                {replyTo && (
                  <>
                    <ArrowRightIcon />
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "inherit",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {replyTo.username}
                    </Typography>
                    {(replyTo._id === user._id ||
                      replyTo._id === noteAuthorId) && (
                      <Chip
                        label={
                          replyTo._id === noteAuthorId ? "Author" : "Yourself"
                        }
                        variant="outlined"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </>
                )}
              </Box>
            }
            secondary={
              isDeleted && author._id !== user._id ? (
                <Typography sx={{ color: "#9499a0", fontStyle: "italic" }}>
                  This content has been deleted
                </Typography>
              ) : (
                <Typography sx={{ color: "black", whiteSpace: "pre-line" }}>
                  {comment.content}
                </Typography>
              )
            }
          />

          {/* delete prompt and delete time */}
          {isDeleted && author._id === user._id && (
            <Typography sx={{ color: "#cb4b10", fontSize: 14 }}>
              Comment deleted · {convertDate(deletedAt)}
            </Typography>
          )}

          {/* reply edit section */}
          {isReplying ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                autoFocus={true}
                multiline
                size="small"
                fullWidth
                placeholder="Add a reply..."
                value={replyContent}
                onChange={handleReplyContentOnChange}
                onBlur={handleReplyContentOnBlur}
                sx={{ mr: 1 }}
              />
              <Chip
                disabled={replyContent.trim() === ""}
                label={
                  <Typography
                    component="span"
                    sx={{
                      bgcolor: "#2e69ff",
                      fontFamily: "inherit",
                      color: "white",
                      fontSize: 14,
                    }}
                  >
                    Reply
                  </Typography>
                }
                onClick={handleAddReply}
                sx={{
                  bgcolor: "#2e69ff",
                  "&:disabled": { opacity: 0.5 },
                  "&:hover": { bgcolor: "#2e69ff" },
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* like section  */}
                {isLike ? (
                  <IconButton
                    disabled={user._id === author._id || isDeleted}
                    aria-label="like"
                    onClick={handleLike}
                    sx={{ p: 0 }}
                  >
                    <ThumbUpOutlinedIcon
                      sx={{
                        color: "#007fff",
                        fontSize: 14,
                        "&:hover": { cursor: "pointer" },
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    disabled={user._id === author._id || isDeleted}
                    aria-label="like"
                    onClick={handleLike}
                    sx={{ p: 0 }}
                  >
                    <ThumbUpOutlinedIcon
                      sx={{
                        color: "#9499a0",
                        fontSize: 14,
                        "&:hover": { color: "#007fff", cursor: "pointer" },
                      }}
                    />
                  </IconButton>
                )}
                <Typography
                  component="span"
                  sx={{
                    mr: 1,
                    fontFamily: "inherit",
                    color: isLike ? "#007fff" : "#9499a0",
                    fontSize: 14,
                  }}
                >
                  &nbsp;{likeCount}
                </Typography>

                {/* reply button  */}
                <Chip
                  label={
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "inherit",
                        color: "#9499a0",
                        fontSize: 14,
                      }}
                    >
                      Reply
                    </Typography>
                  }
                  onClick={handleStartReply}
                  sx={{ bgcolor: "white" }}
                />
              </Box>

              {/* more  */}
              <IconButton aria-label="more" onClick={handleOpenMore}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMore}
                onClose={handleCloseMore}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiMenuItem-root": {
                    fontFamily: "inherit",
                    fontSize: 15,
                  },
                }}
              >
                {user._id === comment.userId ? (
                  <MenuItem onClick={handleDelete}>
                    {isDeleted ? "Undelete" : "Delete"}
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleCloseMore}>Report</MenuItem>
                )}
              </Menu>

              {/* delete and undelete dialog  */}
              <Dialog
                open={openDeleteDialog}
                aria-labelledby="alert-dialog-title"
              >
                <DialogTitle id="alert-dialog-title">
                  {`Are you sure you want to ${
                    isDeleted ? "undelete" : "delete"
                  } this comment?`}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleDeleteComment} autoFocus>
                    Yes
                  </Button>
                  <Button onClick={handleCancelDelete}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </Box>
      </ListItem>
    </>
  );
};

export default ReplyComment;

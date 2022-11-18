import { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { SvgIconComponent } from "@mui/icons-material";
import {
  Button,
  ButtonBase,
  Tooltip,
  Chip,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  TextField,
  Box,
  List,
  Menu,
  MenuItem,
  CardActionArea,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { IconButtonProps } from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { feedback } from "../../../utils/feedback";
import { useAppDispatch } from "../../../state/hooks";
import { Action, Feedback, NoteInfo, UserInfo } from "../../../types/constants";
import UserAvatar from "../../UserAvatar";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { convertCount, convertDate } from "../../../utils/note";
const Comment = dynamic(() => import("../../Comment"));

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IProps {
  note: ForumNote;
  user: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setNotes: React.Dispatch<React.SetStateAction<ForumNote[] | null>>;
}

const ContentItem = ({ note, user, setCurrentUser, setNotes }: IProps) => {
  const {
    _id: noteId,
    mdText,
    title,
    createdAt,
    lastModified,
    firstPublicAt,
    tags,
    like,
    bookmark,
    comment,
    comments,
    author: {
      _id: authorId,
      username: authorName,
      description: authorDescription,
      avatar: authorAvatar,
    },
  } = note;

  const {
    _id: userId,
    username: username,
    description: userDescription,
    avatar: userAvatar,
    following,
    likes,
    bookmarks,
    blocks,
  } = user;

  const { data: session, status } = useSession();
  const [isFollowing, setIsFollowing] = useState(following.includes(authorId));
  const [isLike, setIsLike] = useState(likes.includes(noteId));
  const [likeCount, setLikeCount] = useState(like);
  const [isBookmark, setIsBookmark] = useState(bookmarks.includes(noteId));
  const [bookmarkCount, setBookmarkCount] = useState(bookmark);
  const [commentIds, setCommentIds] = useState(comments);
  const [noteComments, setNoteComments] = useState<ConvertedComment[]>([]);

  // When a new comment is added, it will still be able to display comments correctly number-wise.
  const [newNoteComments, setNewNoteComments] = useState<ConvertedComment[]>(
    []
  );
  const [commentRenderCount, setCommentRenderCount] = useState(5);
  const [commentContent, setCommentContent] = useState("");
  const [commentCount, setCommentCount] = useState(comment);
  const [openComment, setOpenComment] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const commentSectionRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMoreActions = Boolean(anchorEl);

  const [isGetCommentBtnDisabled, setIsGetCommentBtnDisabled] = useState(false);
  const [isFollowBtnDisabled, setIsFollowBtnDisabled] = useState(false);
  const [isLikeBtnDisabled, setIsLikeBtnDisabled] = useState(false);
  const [isBookmarkBtnDisabled, setIsBookmarkBtnDisabled] = useState(false);
  const [isAddCommentBtnDisabled, setIsAddCommentBtnDisabled] = useState(false);
  const [isBlockBtnDisabled, setIsBlockBtnDisabled] = useState(false);
  const [isToDetailedNoteBtnDisabled, setIsToDetailedNoteBtnDisabled] =
    useState(false);
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(false);
  const [isToProfileBtnDisabled, setIsToProfileBtnDisabled] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleGetComment = useCallback(async () => {
    setIsGetCommentBtnDisabled(true);
    try {
      if (!openComment) {
        const {
          data: { convertedComments },
        } = await axios.get("/api/comment", {
          params: { commentIds },
        });
        setNoteComments(convertedComments);
        setNewNoteComments([]);
      }
      setOpenComment((state) => !state);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to get comments. Internal error. Please try later."
      );
    }
    setIsGetCommentBtnDisabled(false);
  }, [openComment, commentIds]);

  const handleFollow = useCallback(async () => {
    setIsFollowBtnDisabled(true);
    try {
      await axios.patch(`/api/user/${userId}`, {
        property: UserInfo.Following,
        action: isFollowing ? Action.Pull : Action.Push,
        value: { following: authorId },
      });
      await axios.patch(`/api/user/${authorId}`, {
        property: UserInfo.Followers,
        action: isFollowing ? Action.Pull : Action.Push,
        value: { followers: userId },
      });

      let newFollowing;
      newFollowing = isFollowing
        ? following.filter((id) => id !== authorId)
        : [...following, authorId];
      setCurrentUser({ ...user, following: newFollowing });
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to delete. Internal error. Please try later."
      );
    }
    setIsFollowBtnDisabled(false);
  }, [isFollowing, following]);

  const handleLike = useCallback(async () => {
    setIsLikeBtnDisabled(true);
    try {
      await axios.patch(`/api/user/${userId}`, {
        property: UserInfo.Likes,
        action: isLike ? Action.Pull : Action.Push,
        value: { likes: noteId },
      });
      await axios.patch(`/api/note/${noteId}`, {
        property: NoteInfo.Like,
        value: isLike ? -1 : 1,
      });

      setLikeCount((state) => (isLike ? state - 1 : state + 1));
      setIsLike((state) => !state);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to delete. Internal error. Please try later."
      );
    }
    setIsLikeBtnDisabled(false);
  }, [isLike]);

  const handleBookmark = useCallback(async () => {
    setIsBookmarkBtnDisabled(true);
    try {
      await axios.patch(`/api/user/${userId}`, {
        property: UserInfo.Bookmarks,
        action: isBookmark ? Action.Pull : Action.Push,
        value: { bookmarks: noteId },
      });
      await axios.patch(`/api/note/${noteId}`, {
        property: NoteInfo.Bookmark,
        value: isBookmark ? -1 : 1,
      });

      setBookmarkCount((state) => (isBookmark ? state - 1 : state + 1));
      setIsBookmark((state) => !state);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to delete. Internal error. Please try later."
      );
    }
    setIsBookmarkBtnDisabled(false);
  }, [isBookmark]);

  const handleExpandClick = useCallback(() => {
    setExpanded((state) => !state);
  }, []);

  const handleCommentContentOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCommentContent(e.target.value);
    },
    []
  );

  const handleAddComment = useCallback(async () => {
    setIsAddCommentBtnDisabled(true);
    try {
      const {
        data: { returnValue },
      } = await axios.post("/api/comment", {
        userId,
        content: commentContent.trim(),
        noteId,
      });
      setCommentContent("");
      delete returnValue["__v"];
      setNewNoteComments((state) => [returnValue, ...state]);
      setCommentIds((state) => [returnValue._id, ...state]);
      setCommentCount((state) => state + 1);
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to add comment. Internal error. Please try later."
      );
    }
    setIsAddCommentBtnDisabled(false);
  }, [commentContent]);

  const handleShowMore = useCallback(() => {
    setCommentRenderCount((state) => state + 5);
  }, []);

  const handleOpenMoreActions = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleCloseMoreActions = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleBlock = useCallback(async () => {
    setIsBlockBtnDisabled(true);
    handleCloseMoreActions();
    try {
      await axios.patch(`/api/user/${userId}`, {
        property: UserInfo.Blocks,
        action: Action.Push,
        value: { blocks: authorId },
      });
      setNotes((state) =>
        state!.filter((note) => note.author._id !== authorId)
      );
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        `Fail to block the user. Internal error. Please try later.`
      );
    }
    setIsBlockBtnDisabled(false);
  }, []);

  const handleToDetailedNote = useCallback(async () => {
    setIsToDetailedNoteBtnDisabled(true);
    await router.push("/notes/" + noteId);
    setIsToDetailedNoteBtnDisabled(false);
  }, []);

  const handleSearchForTag = useCallback(async (tag: string) => {
    setIsSearchBtnDisabled(true);
    await router.push(
      {
        pathname: "/forum",
        query: { search: tag },
      },
      undefined,
      { shallow: true }
    );
    setIsSearchBtnDisabled(false);
  }, []);

  const handleToProfile = useCallback(async () => {
    setIsToProfileBtnDisabled(true);
    if (authorId === userId) {
      await router.push("/profile");
    } else {
      await router.push("/profile/" + authorId);
    }
    setIsToProfileBtnDisabled(false);
  }, []);

  useEffect(() => {
    setIsFollowing(following.includes(authorId));
  }, [following]);

  // When the comment section is open, if it's not in the screen, it will be scrolled to the middle of the screen
  useEffect(() => {
    if (openComment) {
      const { top } = commentSectionRef.current!.getBoundingClientRect();
      const offsetTop = commentSectionRef.current!.offsetTop;
      if (top > window.innerHeight) {
        window.scrollTo({
          top: offsetTop - window.innerHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [openComment]);

  const actionList = [
    {
      label: "Comment",
      info: convertCount(commentCount),
      icon: ChatBubbleOutlineIcon,
      onClick: handleGetComment,
      disabledState: isGetCommentBtnDisabled,
    },
    {
      label: "Like",
      info: convertCount(likeCount),
      icon: isLike ? FavoriteIcon : FavoriteBorderIcon,
      onClick: handleLike,
      state: isLike,
      disabledState: isLikeBtnDisabled,
    },
    {
      label: "Bookmark",
      info: convertCount(bookmarkCount),
      icon: isBookmark ? BookmarkIcon : BookmarkBorderOutlinedIcon,
      onClick: handleBookmark,
      state: isBookmark,
      disabledState: isBookmarkBtnDisabled,
    },
  ];

  return (
    <Card
      sx={{ boxShadow: "none", mb: 1, bgcolor: "#fff", overflow: "visible" }}
    >
      {/* author info */}
      <CardHeader
        avatar={
          <ButtonBase
            disabled={isToProfileBtnDisabled}
            onClick={handleToProfile}
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <UserAvatar image={authorAvatar} name={authorName} />
          </ButtonBase>
        }
        action={
          userId !== authorId && (
            <>
              <IconButton aria-label="settings" onClick={handleOpenMoreActions}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMoreActions}
                onClose={handleCloseMoreActions}
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
                <MenuItem onClick={handleBlock} disabled={isBlockBtnDisabled}>
                  Block
                </MenuItem>
                <MenuItem onClick={handleCloseMoreActions}>Report</MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ButtonBase
              sx={{
                fontWeight: "bold",
                fontFamily: "inherit",
                lineHeight: 1.7,
                "&:hover": { cursor: "pointer" },
              }}
              disabled={isToProfileBtnDisabled}
              onClick={handleToProfile}
            >
              {authorName}
            </ButtonBase>
            {userId === authorId ? (
              <Chip
                label={"You"}
                variant="outlined"
                size="small"
                sx={{ ml: 1 }}
              />
            ) : (
              <>
                <Typography variant="body2" component="span">
                  &nbsp;·&nbsp;
                </Typography>
                <ButtonBase
                  sx={{
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    color: isFollowing ? "#939598" : "#2e69ff",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                    },
                  }}
                  disabled={isFollowBtnDisabled}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </ButtonBase>
              </>
            )}
          </Box>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{
              fontFamily: "inherit",
              color: "gray",
              wordBreak: "break-word",
            }}
          >
            {authorDescription}
            {`${authorDescription === "" ? "" : " · "}`}
            {convertDate(firstPublicAt)}
          </Typography>
        }
        sx={{
          pb: 0,
          "& .MuiCardHeader-title": {
            fontWeight: "bold",
            fontFamily: "inherit",
          },
        }}
      />

      {/* note title  */}
      <CardContent sx={{ pb: 0 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "inherit", lineHeight: "1.4" }}
        >
          {title}
        </Typography>
      </CardContent>

      {/* tags  */}
      {tags.length > 0 && (
        <CardContent sx={{ pt: 0.5, pb: 0 }}>
          {tags.map((tag) => (
            <Button
              key={tag}
              sx={{
                py: 0,
                px: 1,
                mr: 1,
                minWidth: "auto",
                maxWidth: "100%",
                color: "#39739d",
                backgroundColor: "#e1ecf4",
                border: "none",
                textTransform: "none",
                ":hover": { backgroundColor: "#d0e3f1", border: "none" },
              }}
              variant="outlined"
              disabled={isSearchBtnDisabled}
              onClick={() => handleSearchForTag(tag)}
            >
              <Typography
                noWrap={true}
                sx={{ fontSize: 12, fontFamily: "inherit" }}
              >
                {tag}
              </Typography>
            </Button>
          ))}
        </CardContent>
      )}
      <CardActionArea
        disabled={isToDetailedNoteBtnDisabled}
        onClick={handleToDetailedNote}
      >
        {/* note content  */}
        <CardContent
          sx={{ maxHeight: expanded ? "none" : 200, overflowY: "hidden" }}
        >
          <ReactMarkdown
            skipHtml={true}
            className="markdown-body"
            components={{
              code({
                node,
                inline,
                className,
                children,
                style,
                ...props
              }: CodeProps) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    // children={String(children).replace(/\n$/, "")}
                    wrapLongLines={true}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
            remarkPlugins={[remarkGfm]}
          >
            {mdText}
          </ReactMarkdown>
        </CardContent>
      </CardActionArea>
      {/* comment section button, like button, bookmark button and expand button  */}
      <CardActions
        sx={{
          bgcolor: "#fff",
          position: expanded ? "sticky" : "static",
          bottom: 0,
        }}
        disableSpacing
      >
        {actionList.map((action, index) => (
          <ActionButton key={index} action={action} />
        ))}

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* comment section */}
      {openComment && (
        <Box>
          <CardContent ref={commentSectionRef}>
            <Grid container spacing={1}>
              <Grid xs={11}>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Add a comment..."
                  sx={{ height: "100%" }}
                  value={commentContent}
                  onChange={handleCommentContentOnChange}
                />
              </Grid>
              <Grid
                xs={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ pt: 1, mb: 1 }}>
                  <UserAvatar image={userAvatar} name={username} />
                </Box>
                <Button
                  disabled={
                    commentContent.trim() === "" || isAddCommentBtnDisabled
                  }
                  variant="contained"
                  sx={{
                    width: "50%",
                    fontFamily: "inherit",
                    fontSize: 12,
                    textTransform: "none",
                  }}
                  onClick={handleAddComment}
                >
                  Comment
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent sx={{ "&.MuiCardContent-root": { pt: 0, pb: 2 } }}>
            <List disablePadding={true}>
              {newNoteComments!.map((noteComment) => {
                return (
                  <Comment
                    comment={noteComment}
                    noteAuthorId={authorId}
                    user={user}
                    noteId={noteId}
                    setCommentCount={setCommentCount}
                    key={noteComment._id}
                  />
                );
              })}
              {noteComments!.map((noteComment, index) => {
                if (index < commentRenderCount) {
                  return (
                    <Comment
                      comment={noteComment}
                      noteAuthorId={authorId}
                      user={user}
                      noteId={noteId}
                      setCommentCount={setCommentCount}
                      key={noteComment._id}
                    />
                  );
                }
              })}
            </List>
            {noteComments.length - commentRenderCount > 0 && (
              <Button
                onClick={handleShowMore}
                variant="outlined"
                sx={{
                  width: "100%",
                  borderRadius: "50px",
                  backgroundColor: "#00000008",
                  borderColor: "#0000001f",
                  textTransform: "none",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: "#636466",
                  "&:hover": {
                    backgroundColor: "#ececee",
                    borderColor: "#0000001f",
                  },
                }}
              >
                View more comments <ArrowDropDownIcon />
              </Button>
            )}
          </CardContent>
        </Box>
      )}
    </Card>
  );
};

export default ContentItem;

interface ActionButtonIProps {
  action: {
    label: string;
    icon: SvgIconComponent;
    info?: string;
    onClick: () => void;
    state?: boolean;
    disabledState: boolean;
  };
}

const ActionButton = ({ action }: ActionButtonIProps) => {
  const { label, icon: Icon, info, onClick, state, disabledState } = action;
  return (
    <Tooltip title={label} arrow placement="top">
      <IconButton
        disabled={disabledState}
        aria-label={label}
        size="small"
        sx={{ borderRadius: "20%", color: state ? "#007fff" : "" }}
        onClick={onClick}
      >
        <Icon sx={{ fontSize: 20, mr: 1 }} />
        <Typography sx={{ fontFamily: "inherit" }}>{info}</Typography>
      </IconButton>
    </Tooltip>
  );
};

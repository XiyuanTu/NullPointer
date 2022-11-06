import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  margin: 'auto',
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IProps {
  note: Note;
}

const ContentItem = ({ note }: IProps) => {
  const {_id, title, tags, mdText } = note;
  const router = useRouter()
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((state) => !state);
  }, []);

  const handleRedirect = useCallback(() => {
    router.push('/note/' + _id)
  }, [])

  return (
    <Card
      sx={{ boxShadow: "none", mb: 1, bgcolor: "#fff", overflow: "visible" }}
    >
      <CardActionArea onClick={handleRedirect}>
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

      {/* note content  */}
      <CardContent sx={{ maxHeight: expanded ? "none" : 300, overflowY: "hidden" }}>
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
                  children={String(children).replace(/\n$/, "")}
                  wrapLongLines={true}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
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
      <CardActions
        sx={{
          bgcolor: "#fff",
          position: expanded ? "sticky" : "static",
          bottom: 0,
        }}
        disableSpacing
      >
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
};

export default ContentItem;

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Pagination,
} from "@mui/material";
import ContentItem from "./ContentItem";
import Image from "next/image";
import { useRouter } from "next/router";
import { calRelevance } from "../../../utils/note";

interface IProps {
  convertedData: ForumNote[];
  user: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ForumContent = ({ convertedData, user: currentUser, setCurrentUser }: IProps) => {
  const router = useRouter();
  const [rawNotes, setRawNotes] = useState<ForumNote[]>(convertedData);
  const [notes, setNotes] = useState<ForumNote[] | null>(null);
  const [searchText, setSearchText] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");

  const handleSortByOnChange = useCallback((event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  }, []);

  const handlePageOnChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    },
    []
  );

  useEffect(() => {
    setSearchText(router.query.search);
    if (router.query.search) {
      setNotes(calRelevance(router.query.search as string, rawNotes));
    } else {
      setNotes(rawNotes);
    }
  }, [router.query.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (notes) {
      setCurrentPage(1);
      switch (sortBy) {
        case "relevance":
          setNotes((state) => [
            ...state!.sort((a, b) => {
              if (a.relevance === b.relevance) {
                if ((a.like === b.like)) {
                  const dateA = new Date(a.firstPublicAt);
                  const dateB = new Date(b.firstPublicAt);
                  return dateB.getTime() - dateA.getTime();
                }
                return b.like - a.like;
              }
              return b.relevance! - a.relevance!;
            }),
          ]);
          break;
        case "likes":
          setNotes((state) => [
            ...state!.sort((a, b) => {
              if (a.like === b.like) {
                if ((a.relevance === b.relevance)) {
                  const dateA = new Date(a.firstPublicAt);
                  const dateB = new Date(b.firstPublicAt);
                  return dateB.getTime() - dateA.getTime();
                }
                return b.relevance! - a.relevance!;
              }
              return b.like - a.like;
            }),
          ]);
          break;
        case "time":
          setNotes((state) => [
            ...state!.sort((a, b) => {
              const dateA = new Date(a.firstPublicAt);
              const dateB = new Date(b.firstPublicAt);
              if (dateA.getTime() === dateB.getTime()) {
                return (a.relevance = b.relevance
                  ? b.like - a.like
                  : b.relevance! - a.relevance!);
              }
              return dateB.getTime() - dateA.getTime();
            }),
          ]);
          break;
      }
    }
  }, [sortBy]);

  if (!notes) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          pt: 1,
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
          We couldn&apos;t find anything!
        </Typography>
        <Image src="/no_data.jpg" width={900} height={590} />
      </Box>
    );
  }

  return (
    <Box>
      {searchText && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
            py: 1.5,
            position: "sticky",
            top: "9vh",
            bgcolor: "rgb(241, 242, 242)",
            zIndex: 99,
          }}
        >
          <Typography>
            {(currentPage - 1) * 8 + 1} -{" "}
            {Math.min(currentPage * 8, notes.length)} of {notes.length} results for &quot;{router.query.search}&quot;
          </Typography>
          <Box>
            <FormControl sx={{ mr: 1 }} size="small">
              <InputLabel id="sortBy">Sort by</InputLabel>
              <Select
                labelId="sortBy"
                id="sortBy"
                value={sortBy}
                label="Sort by"
                onChange={handleSortByOnChange}
                autoWidth
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="likes">Likes</MenuItem>
                <MenuItem value="time">Time</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      {notes.map((note, index) => {
        if (
          index >= (currentPage - 1) * 8 &&
          index < Math.min(currentPage * 8, notes.length)
        ) {
          return (
            <ContentItem
              key={note._id}
              note={note}
              user={currentUser}
              setCurrentUser={setCurrentUser}
              setNotes={setNotes}
            />
          );
        }
      })}
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Pagination
          count={Math.ceil(notes.length / 8)}
          color="primary"
          page={currentPage}
          onChange={handlePageOnChange}
        />
      </Box>
    </Box>
  );
};

export default ForumContent;


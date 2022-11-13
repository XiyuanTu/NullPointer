export const convertCount = (count: number) => {
  if (count < 1000) {
    return count + "";
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return (count / 1000000).toFixed(1) + "M";
  }
};

export const convertDate = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const hoursBetweenDates = (now.getTime() - date.getTime()) / (60 * 60 * 1000);

  if (hoursBetweenDates < 1) {
    const minute = hoursBetweenDates * 60;
    if (minute < 1) {
      return "Just now";
    }
    return minute.toFixed() + (minute < 1.5 ? " min ago" : " mins ago");
  } else if (hoursBetweenDates < 24) {
    return (
      hoursBetweenDates.toFixed() +
      (hoursBetweenDates < 1.5 ? " hr ago" : " hrs ago")
    );
  } else if (hoursBetweenDates < 24 * 7) {
    return date.toLocaleString("en-US", { weekday: "short" });
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleString("en-US", { month: "long", day: "numeric" });
  } else {
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const calRelevance = (search: string, notes: ForumNote[]) => {
  const words = search.split(" ").map((word) => word.toLowerCase());
  return notes
    .map((note) => {
      const wordSet = new Set(
        note.title.split(" ").map((word) => word.toLowerCase())
      );
      note.tags.forEach((tag) => wordSet.add(tag.toLowerCase()));
      let count = 0;
      words.forEach((word) => wordSet.has(word) && count++);
      return { ...note, relevance: count / words.length };
    })
    .filter((note) => note.relevance > 0)
    .sort((a, b) => {
      if (a.relevance === b.relevance) {
        if (a.like === b.like) {
          const dateA = new Date(a.firstPublicAt);
          const dateB = new Date(b.firstPublicAt);
          return dateB.getTime() - dateA.getTime();
        }
        return b.like - a.like;
      }
      return b.relevance! - a.relevance!;
    });
};

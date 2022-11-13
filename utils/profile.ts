export const sortingCompareFn = (a: Note, b: Note, sortBy: string, order: string) => {
    let dateA = new Date(),
      dateB = new Date();
    switch (sortBy) {
      case "createdAt":
        dateA = new Date(a.createdAt);
        dateB = new Date(b.createdAt);
        break;
      case "lastModified":
        dateA = new Date(a.lastModified);
        dateB = new Date(b.lastModified);
        break;
    }
  
    if (order === "oldest") {
      return dateA.getTime() - dateB.getTime();
    }
  
    return dateB.getTime() - dateA.getTime();
  };
  
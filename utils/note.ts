import { FileOrFolder } from "../types/constants";

export const convertTreeViewData = (rawData: any[]): RenderTree => {
  const data: RenderTree = {
    id: "root",
    level: -1,
    name: "root",
    isNew: false,
    children: [],
  };

  const folders: RenderTree[] = [];

  const map = new Map<string, RenderTree[]>();

  rawData.map((obj) => {
    let newObj: RenderTree = {
      id: obj._id + "",
      level: 0,
      name: obj.name,
      isNew: false,
    };

    if (obj.type === FileOrFolder.Folder) {
      newObj.children = [];
    } else {
      newObj.public = obj.public;
      newObj.favorite = obj.favorite;
    }

    if (obj.belongTo) {
      if (map.has(obj.belongTo + "")) {
        map.get(obj.belongTo + "")!.push(newObj);
      } else {
        map.set(obj.belongTo + "", [newObj]);
      }
    } else {
      if (obj.type === FileOrFolder.Folder) {
        folders.push(newObj);
      }
      data.children!.push(newObj);
    }
  });

  const compareFn = (a: RenderTree, b: RenderTree) => {
    if ((a.children === undefined) === (b.children === undefined))
      return a.name > b.name ? 1 : -1;

    return a.children ? -1 : 1;
  };

  data.children!.sort(compareFn);

  const getChildren = (obj: RenderTree, level: number) => {
    obj.level = level;

    // if it's a file or if it's a folder but nothing in it
    if (!obj.children || !map.has(obj.id)) return;

    obj.children = map.get(obj.id);
    obj.children!.sort(compareFn);

    obj.children!.map((child) => getChildren(child, level + 1));
  };

  folders.map((folder) => getChildren(folder, 0));

  return data;
};

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

export const convertNote = (note: Note) => {
  note._id = note._id + "";
  note.userId = note.userId + ''
  note.createdAt = note.createdAt.toLocaleString()
  note.lastModified = note.lastModified.toLocaleString()
  if (note.firstPublicAt) {
    note.firstPublicAt = note.firstPublicAt.toLocaleString()
  }
  note.comments = note.comments.map(comment => comment + '')
  return note;
}
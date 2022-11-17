import UserAccount from "../models/user/userAccountModel";
import connectDB from "./connectDB";
import mongoose from "mongoose";


export const convertForumData = async (rawNotes: any[]) => {
  await connectDB();
  const newNotes: ForumNote[] = [];

  for (let rawNote of rawNotes) {
    const author = await UserAccount.findById(rawNote.userId, {
      password: 0,
    }).lean();
    author._id = author._id + "";
    author.blocks = author.blocks.map((blockId: mongoose.Types.ObjectId) => blockId + '')
    let comments = []
    for (let id of rawNote.comments) {
      comments.push(id + "")
    }
    delete rawNote.userId;
    newNotes.push({
      ...rawNote,
      _id: rawNote._id + "",
      author,
      createdAt: new Date(rawNote!.createdAt).toLocaleString(),
      lastModified: new Date(rawNote!.lastModified).toLocaleString(),
      firstPublicAt: new Date(rawNote!.firstPublicAt).toLocaleString(),
      comments
    });
  }

  return newNotes;
};








import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import UserAccount from "../../../models/user/userAccountModel";
import Note from "../../../models/note/noteModel";
import { convertForumData } from "../../../utils/forum";
import { convertUser } from "../../../utils/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      await connectDB();

      const user = await UserAccount.findById(id, {
        email: 0,
        password: 0,
      }).lean();
      const convertedUser = convertUser(user);

      const notes = await Note.find(
        { public: true, userId: { $nin: user.blocks } },
        { name: 0, public: 0, favorite: 0, belongTo: 0 }
      ).lean();
      const convertedData = await convertForumData(notes);
      convertedData.sort((a, b) => b.like - a.like);

      const whoToFollow: User[] = await UserAccount.find(
        {
          _id: { $nin: [...user.blocks, ...user.following, id] },
        },
        { email: 0, password: 0 }
      ).lean();

      const convertedWhoToFollow = whoToFollow
        .map((user) => convertUser(user))
        .sort((a, b) => b.following.length - a.following.length)
        .slice(0, 6);

      return res.status(200).json({ message: "Success", user: convertedUser, forumData: convertedData, whoToFollow: convertedWhoToFollow});
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}

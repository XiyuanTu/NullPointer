import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/connectDB";
import UserAccount from "../../../models/user/userAccountModel";

interface Data {
  message?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    return;
  }

  const [property, value] = req.query.slug as string[];

  try {
    await connectDB();

    //There should be a better way to code this
    let condition;
    if (property === "username") {
      condition = { username: value };
    } else if (property === "email") {
      condition = { email: value };
    }

    const result = await UserAccount.findOne(condition);
    if (result) {
      res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Fail to verify the " + property });
  }
}

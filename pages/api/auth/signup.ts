import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/connectDB";
import UserAccount from "../../../models/user/userAccountModel";
import {
  emailFormatCheck,
  verifyEmail,
} from "../../../utils/auth/emailValidation";
import { passwordFormatCheck, hashPassword } from "../../../utils/auth/passwordValidation";
import {
  usernameFormatCheck,
  verifyUsername,
} from "../../../utils/auth/usernameValidation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const { username, email, password } = data;

  if (!usernameFormatCheck(username)) {
    return res.status(422).json({ message: "Invalid username!" });
  }
  if (!emailFormatCheck(email)) {
    return res.status(422).json({ message: "Invalid email!" });
  }

  if (!passwordFormatCheck(password)) {
    return res.status(422).json({ message: "Invalid password!" });
  }

  try {
    const isUsernameNotTaken = await verifyUsername(username);
    const isEmailNotTaken = await verifyEmail(email);
    
    if (!isUsernameNotTaken) {
      return res.status(422).json({ message: "Username has already been taken!" });
    }

    if (!isEmailNotTaken) {
      return res.status(422).json({ message: "Email has already been taken!" });
    }

    await connectDB();
    const hashedPassword = await hashPassword(password)
    const userAccount = new UserAccount({username, email, password: hashedPassword});
    await userAccount.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "Fail to process" });
  }
}

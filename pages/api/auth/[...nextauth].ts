import NextAuth, { Account, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../utils/connectDB";
import UserAccount from "../../../models/user/userAccountModel";
import GithubUser from "../../../models/user/githubUserModel";
import GoogleUser from "../../../models/user/googleUserModel";
import { verifyPassword } from "../../../utils/auth/passwordValidation";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {

        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        await connectDB();
        const userAccount = await UserAccount.findOne({ email });

        if (!userAccount) {
          throw new Error("No user found");
        }

        const isValid = await verifyPassword(password, userAccount.password);

        if (!isValid) {
          throw new Error("Wrong password");
        }

        return { id: userAccount._id , name: userAccount.username, email };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (credentials) return true;

      const { name, email: userEmail, image } = user;
      const { provider, providerAccountId } = account as Account;

      await connectDB();

      let externalUser;

      switch (provider) {
        case "google":
          externalUser = await GoogleUser.findOne({
            externalId: providerAccountId,
          });
          break;
        case "github":
          externalUser = await GithubUser.findOne({
            externalId: providerAccountId,
          });
          break;
      }

      if (externalUser) return true;

      try {
        const userAccount = new UserAccount({
          username: name,
          email: userEmail,
          avatar: image,
        });
        const newUserAccount = await userAccount.save();
        let newUser;
        switch (provider) {
          case "google":
            newUser = new GoogleUser({
              userId: newUserAccount._id,
              externalId: providerAccountId,
            });
            break;
          case "github":
            newUser = new GithubUser({
              userId: newUserAccount._id,
              externalId: providerAccountId,
            });
            break;
        }
        await newUser.save();
        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      const provider = token.provider;
      await connectDB();

      let user;

      if (provider === "credentials") {
        user = await UserAccount.findOne({ email: session.user.email });
        session.user.id = user._id;
      } else {
        switch (provider) {
          case "google":
            user = await GoogleUser.findOne({ externalId: token.sub });
            break;
          case "github":
            user = await GithubUser.findOne({ externalId: token.sub });
            break;
        }
        session.user.id = user.userId;
        user = await UserAccount.findById(user.userId);
      }
      if (user.avatar) session.user.image = user.avatar;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

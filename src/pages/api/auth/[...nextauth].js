import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/mydb";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err) {
          console.log("Error authorizing user", err);
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
    },
    async session(session, user) {
      //Make API callh here
      const additionalData = {
        reservationsApril: [
          {
            email: "peter@gmail.com",
            name: "Peter",
            tableNumber: 1,
            peopleCount: 20,
            start: "2024-04-01T10:00:00.000+00:00",
            end: "2024-04-01T12:00:00.000+00:00",
            status: "checked",
          },
          {
            tableNumber: 2,
            email: "ulf@gmail.com",
            name: "Ulf",
            peopleCount: 1,
            start: "2024-04-08T19:30:00.000+00:00",
            end: "2024-04-08T19:30:00.000+00:00",
            status: "checked",
          },
          {
            tableNumber: 3,
            email: "sat@gmail.com",
            name: "Sat",
            peopleCount: 4,
            start: "2024-04-28T16:30:00.000+00:00",
            end: "2024-04-28T17:30:00.000+00:00",
          },
        ],
      };

      session.data = additionalData;
      return session;
    },
  },
};
export default NextAuth(authOptions);

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User.js";
import Reservation from "@/models/Reservation.js";
import Table from "@/models/Table.js";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/mydb";

import { getReservations, getTables } from "../../../utils/utils.js";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await User.findOne({ name: credentials.name });

          console.log(user);
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
      console.log("loggin in");
      if (account?.provider === "credentials") {
        return true;
      }
    },
    async session(session, user) {
      //Get API Reservations here
      // Reservation NEVER NULL!!!!
      let reservations;
      try {
        const thisYear = new Date().getFullYear();
        const nextMonth = parseInt(month) + parseInt(1);

        const firstDayOfMonth = new Date(thisYear, month, 1);
        const lastDayOfMonth = new Date(thisYear, nextMonth, 0);

        reservations = await Reservation.find({
          start: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        }).sort({ start: 1 });
      } catch (e) {
        reservations = [];
        console.log("failed to load reservations in session");
      }

      let tables;
      try {
        table = await Table.findOne({});
      } catch (e) {
        tables = [];
        console.log("failed to load tables in session");
      }

      session.data = { reservations: reservations.data, tables: tables.data };
      return session;
    },
  },
};
export default NextAuth(authOptions);

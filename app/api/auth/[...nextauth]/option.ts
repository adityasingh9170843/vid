import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DBconnect";
import User from "@/models/User";
import { create } from "domain";

export const authOptions: NextAuthOptions = {

  
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if(!isValid) {
            throw new Error("Invalid password");
          }
          return user;
          
        } catch (err: any) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.error("Authorize error:", err);
          throw new Error(err.message || "Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

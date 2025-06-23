import NextAuth from "next-auth";

declare module "next-auth" {
    interface user{
        id: string
    }
}
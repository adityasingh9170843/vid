import NextAuth from "next-auth";

declare module "next-auth" {
  
  interface Session {
    user: {
      id?: string;
    } 
  }

  interface User {
    id?: string;
    name?: string;
    createdAt?: Date;
  }
}
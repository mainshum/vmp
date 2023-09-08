import GP from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { UserRole } from "@/types/shared";
import { db } from "./db";

const dbMock = {
  async findUserRole(email: string): Promise<UserRole> {
    return email.includes("vendor")
      ? "vendor"
      : email.includes("client")
      ? "client"
      : "none";
  },
};

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    newUser: "/role-select",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GP({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      const role = await dbMock.findUserRole(token!.email!);

      session.user.role = role;

      return session;
    },
  },
};

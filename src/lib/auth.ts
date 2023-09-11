import GP from "next-auth/providers/google";
import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/sign-in",
    newUser: "/role-select",
  },
  session: {
    strategy: "database",
  },
  providers: [
    GP({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role;
      session.user.id = user.id;

      return session;
    },
    redirect() {
      return "/";
    },
  },
};

export const getVMPSession = async () =>
  await getServerSession(nextAuthOptions);

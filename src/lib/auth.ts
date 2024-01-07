import GP from "next-auth/providers/google";
import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
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
    {
      id: "email",
      type: "email",
      from: "aleksander@vendormarketplace.org",
      server: {},
      name: "Email",
      options: {},
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier: email, url }) {
        // Call the cloud Email provider API for sending emails
        // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          // The body format will vary depending on provider, please see their documentation
          // for further details.
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: "noreply@vendormarketplace.org" },
            subject: "Sign in to Your page",
            content: [
              {
                type: "text/plain",
                value: `Please click here to authenticate - ${url}`,
              },
            ],
          }),
          headers: {
            // Authentication will also vary from provider to provider, please see their docs.
            Authorization: `Bearer ${process.env.SENDGRID_API}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (!response.ok) {
          const { errors } = await response.json();
          throw new Error(JSON.stringify(errors));
        }
      },
    },
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

export type NextSession = Awaited<ReturnType<typeof getVMPSession>>;

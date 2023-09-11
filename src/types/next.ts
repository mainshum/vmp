import { getServerSession } from "next-auth";

export type PageParams = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type GetServerSession = ReturnType<typeof getServerSession>;

export type ErrorComp = {
  error: Error & { digest?: string };
  reset: () => void;
};

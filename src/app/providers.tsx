"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

// TODO figure out if this wrapper is neceesary if we're doing hydration instead
export const TenstackProvider = ({ children }: Props) => {
  const [client] = React.useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

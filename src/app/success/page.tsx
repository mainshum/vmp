import { PageParams } from "@/types/next";
import React from "react";
import { Success } from "@/components/success";

export default async function Home({ searchParams }: PageParams) {
  const type = searchParams["type"];

  return <Success type={type} />;
}

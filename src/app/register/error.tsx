"use client";
import { Error as E } from "@/components/success";
import { H1 } from "@/components/typography";
import { ErrorComp } from "@/types/next";
export default function Error(props: ErrorComp) {
  return <E {...props} />;
}

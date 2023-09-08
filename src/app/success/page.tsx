import Image from "next/image";
import * as Typo from "@/components/typography";
import { Button, buttonVariants } from "@/components/ui/Button";
import { PageParams } from "@/types/next";
import { match } from "ts-pattern";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Home({ searchParams }: PageParams) {
  const type = searchParams["type"];

  return (
    <div className="center-absolute justify-around px-16">
      <section className="basis-64 space-y-8">
        {match(type)
          .with("customer_registered", () => (
            <React.Fragment>
              <Typo.H1>Success!</Typo.H1>
              <Typo.H2>
                You are now registered as VMP customer and ready to submit your
                first job posting.
              </Typo.H2>
              <Link className={cn(buttonVariants())} href="/client/postings">
                Get started
              </Link>
            </React.Fragment>
          ))
          .otherwise(() => (
            <React.Fragment>
              <Typo.H1>Success!</Typo.H1>
              <Typo.H2>Are you here by mistake?</Typo.H2>
            </React.Fragment>
          ))}
      </section>
      <Image
        src="/balmer-dance.gif"
        className="hidden rounded-xl md:block md:w-[400px] lg:w-[600px] xl:w-[800px]"
        width={800}
        height={500}
        alt="Developers, developers"
      />
    </div>
  );
}

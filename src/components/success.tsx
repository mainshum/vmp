import Image from "next/image";
import * as Typo from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { match } from "ts-pattern";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/const";
import { ErrorComp } from "@/types/next";

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="center-absolute justify-around px-16">{children}</div>;
}

export function Error({ error, reset }: ErrorComp) {
  return (
    <Wrap>
      <Typo.H1 className="text-center">404</Typo.H1>
      <Typo.H2 className="text-center">Unexpected error occured</Typo.H2>
    </Wrap>
  );
}

export function Success({ type }: { type?: string | string[] }) {
  return (
    <Wrap>
      <section className="basis-64 space-y-8">
        {match(type)
          .with("customer_registered", () => (
            <React.Fragment>
              <Typo.H1>Success!</Typo.H1>
              <Typo.H2>
                You are now registered as VMP customer and ready to submit your
                first job posting.
              </Typo.H2>
              <Link
                className={cn(buttonVariants())}
                href={ROUTES.CUSTOMER.POSTINGS}
              >
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
    </Wrap>
  );
}

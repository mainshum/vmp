"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React, { useContext, useState } from "react";
import { cn, reduceSum } from "@/lib/utils";
import { Nullalble } from "@/types/shared";
import { FileText, Loader2, MoreHorizontal, StarIcon } from "lucide-react";
import { createDate } from "./shared";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { ROUTES } from "@/lib/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OfferGrade } from "@prisma/client";

type ActionsContext = {
  // eslint-disable-next-line no-unused-vars
  handleOfferRemoval?: (offerId: string) => void;
  toggleRatingDetails: (offerId: string) => void;
  enableEditing: boolean;
  starsIdOpened: Nullalble<string>;
};

const ctx = React.createContext<ActionsContext>({} as ActionsContext);

const Stars = ({ stars }: { stars: number }) => (
  <span className="flex">
    {Array(5)
      .fill(null)
      .map((_, ind) => {
        const starNo = ind + 1;
        return (
          <StarIcon
            key={ind}
            className={cn("h-4 w-4", starNo <= stars && "fill-orange-200")}
          />
        );
      })}
  </span>
);

function OfferRatings({
  offerGrade: offerGrade,
  offerId,
}: {
  offerGrade: OfferGrade;
  offerId: string;
}) {
  const { starsIdOpened } = useContext(ctx);
  const [ref] = useAutoAnimate();

  return (
    <section ref={ref} className="flex flex-col gap-4">
      {starsIdOpened && (
        <>
          <span>Logistics fit</span>
          <Stars stars={offerGrade.n_logistics} />
          <span>Rate fit</span>
          <Stars stars={offerGrade.n_rateFit} />
        </>
      )}
      {!starsIdOpened &&
        (() => {
          const stars = [
            offerGrade.n_logistics,
            offerGrade.n_rateFit,
            offerGrade.n_seniorityFit,
            offerGrade.n_technologyFit,
            offerGrade.n_vendorScore,
          ];

          const avgGrade = stars.reduce(reduceSum) / stars.length;

          return <Stars stars={avgGrade} />;
        })()}
    </section>
  );
}

type OfferSchema = RouterOutputs["CLIENT"]["offers"][0];

const PDFFile = ({ offerId, cv }: { offerId: string; cv: string }) => {
  const downloadCV = () => {
    const linkSource = cv;
    const downloadLink = document.createElement("a");
    const fileName = "CV.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return <FileText className="h-4 w-4 cursor-pointer" onClick={downloadCV} />;
};

function Actions({ offerId }: { offerId: string }) {
  const {
    enableEditing,
    handleOfferRemoval,
    toggleRatingDetails: showRatingDetails,
  } = useContext(ctx);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => showRatingDetails(offerId)}>
          Toggle rating details
        </DropdownMenuItem>
        {handleOfferRemoval && (
          <DropdownMenuItem onClick={() => handleOfferRemoval(offerId)}>
            Remove offer
          </DropdownMenuItem>
        )}
        {enableEditing && (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.OFFERS.EDIT(offerId)}>View offer</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const offersColumns: ColumnDef<OfferSchema>[] = [
  {
    accessorKey: "id",
    header: "Offer ID",
    cell: ({ row }) => (
      <span className="pr-[1.6rem]">{row.getValue("id")}</span>
    ),
  },
  {
    header: "Grade",
    accessorKey: "offerGrade",
    cell: ({ row }) => {
      return (
        <OfferRatings
          offerGrade={row.getValue("offerGrade") as OfferGrade}
          offerId={row.getValue("id")}
        />
      );
    },
  },
  {
    accessorKey: "offerStatus",
    header: "Status",
  },
  {
    accessorKey: "creationDate",
    header: "Created at",
    cell: ({ row }) => createDate(row.getValue("creationDate")),
  },
  {
    accessorKey: "validUntil",
    header: "Valid until",
    cell: ({ row }) => createDate(row.getValue("validUntil")),
  },
  {
    accessorKey: "cv",
    header: "CV",
    cell: ({ row }) => {
      return <PDFFile offerId={row.original.id} cv={row.getValue("cv")} />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions offerId={row.original.id} />,
  },
];

// admin and vendor
export function OffersTable({
  opportunityId: opId,
}: {
  opportunityId: string;
}) {
  const [starsIdOpened, setStarsIdOpened] = useState<Nullalble<string>>(null);
  const { data } = trpc.CLIENT.offers.useQuery(opId);

  const [divRef] = useAutoAnimate();

  const toggleRatingDetails = (offerId: string) =>
    setStarsIdOpened((cur) => (cur === null ? offerId : null));

  return (
    <ctx.Provider
      value={{ enableEditing: true, toggleRatingDetails, starsIdOpened }}
    >
      <div ref={divRef}>
        {data ? (
          <DataTable columns={offersColumns} data={data} />
        ) : (
          <div className="flex items-center justify-center gap-2 p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Loading offers</span>
          </div>
        )}
      </div>
    </ctx.Provider>
  );
}

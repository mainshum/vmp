"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React, { useContext } from "react";
import { cn } from "@/lib/utils";
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

type ActionsContext = {
  // eslint-disable-next-line no-unused-vars
  handleOfferRemoval?: (offerId: string) => void;
  enableEditing: boolean;
};

const ctx = React.createContext<ActionsContext>({} as ActionsContext);

function Stars({ matchingStars }: { matchingStars: Nullalble<number> }) {
  const orangeStars = !matchingStars ? 0 : matchingStars;

  return (
    <span className="flex">
      {Array(5)
        .fill(null)
        .map((_, ind) => {
          const starNo = ind + 1;
          return (
            <StarIcon
              key={ind}
              className={cn(
                "h-4 w-4",
                starNo <= orangeStars && "fill-orange-200",
              )}
            />
          );
        })}
    </span>
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
  const { enableEditing, handleOfferRemoval } = useContext(ctx);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
    accessorKey: "matchingGrade",
    cell: ({ row }) => {
      return <Stars matchingStars={row.getValue("matchingGrade")} />;
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
  const { data } = trpc.CLIENT.offers.useQuery(opId);

  const [divRef] = useAutoAnimate();

  return (
    <ctx.Provider value={{ enableEditing: true }}>
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

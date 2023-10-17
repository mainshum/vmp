"use client";

import {
  ColumnDef,
  IdentifiedColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, HelpCircle, StarIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { Offer, Prisma } from "@prisma/client";
import { Nullalble } from "@/types/shared";
import { cn, noop } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { OfferSchema } from "zod-types";

const opsWithOffers = Prisma.validator<Prisma.OpportunityArgs>()({
  include: { offers: true },
});

export type OpsWithOffers = Prisma.OpportunityGetPayload<typeof opsWithOffers>;

const chevronClasses = "h-4 w-4";

const createDate = (val: Nullalble<Date>) => {
  if (val) return val.getTime();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          Not available until the opportunity/offer is approved
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const opsColumns: ColumnDef<OpsWithOffers>[] = [
  {
    accessorKey: "id",
    header: "ID",

    cell: ({ row }) => {
      return (
        <span className="flex gap-2">
          <button
            {...{
              onClick: () => row.toggleExpanded(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className={chevronClasses} />
            ) : (
              <ChevronRight className={chevronClasses} />
            )}
          </button>
          <span>{row.getValue("id")}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "status",
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
];

type MutateStarsPayload = { id: string; matchingGrade: number };

type Ctx = {
  // eslint-disable-next-line no-unused-vars
  onStarsToggled: ({ id, matchingGrade }: MutateStarsPayload) => void;
};

export const HandlersCtx = React.createContext<Ctx>({ onStarsToggled: noop });

function Stars({
  offerId,
  matchingStars,
}: {
  offerId: string;
  matchingStars: Nullalble<number>;
}) {
  const orangeStars = !matchingStars ? 0 : matchingStars;

  const [hoverInd, setHoverInd] = useState<Nullalble<number>>(null);

  const { onStarsToggled } = useContext(HandlersCtx);

  return (
    <span className="flex">
      {Array(5)
        .fill(null)
        .map((_, ind) => {
          const starNo = ind + 1;
          return (
            <StarIcon
              key={ind}
              onMouseOver={() => setHoverInd(starNo)}
              onMouseOut={() => setHoverInd(null)}
              onClick={() => {
                if (orangeStars === starNo) return;
                onStarsToggled({ id: offerId, matchingGrade: starNo });
              }}
              className={cn(
                "h-4 w-4 cursor-pointer",
                starNo <= orangeStars && "fill-orange-200",
                hoverInd && starNo <= hoverInd && "fill-orange-300",
              )}
            />
          );
        })}
    </span>
  );
}

export const offersColumns: ColumnDef<Offer>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="pr-[1.6rem]">{row.getValue("id")}</span>
    ),
  },
  {
    header: "Grade",
    accessorKey: "matchingGrade",
    cell: ({ row }) => {
      return (
        <Stars
          offerId={row.original.id}
          matchingStars={row.getValue("matchingGrade")}
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
];

const toggleStars = ({
  id,
  matchingGrade,
}: {
  id: string;
  matchingGrade: number;
}) =>
  fetch("/api/offer", {
    method: "PUT",
    body: JSON.stringify({ id, matchingGrade }),
  });

export function OpportunityTable({ data }: { data: OpsWithOffers[] }) {
  const { toast } = useToast();

  const [tableData, setTableData] = useState(data);

  const mutation = useMutation({
    mutationFn: toggleStars,
    onSuccess: async (res) => {
      if (res.status !== 200)
        return toast({
          title: "Something went wrong",
          description: "Grade was not updated",
          variant: "destructive",
        });

      // TODO log unexpected response
      const { id, matchingGrade, opportunityId } = OfferSchema.pick({
        id: true,
        matchingGrade: true,
        opportunityId: true,
      }).parse(await res.json());

      setTableData((cur) => {
        return produce(cur, (draft) => {
          const op = draft.find((op) => op.id === opportunityId);
          if (!op) return;
          const of = op.offers.find((of) => of.id === id);
          if (!of) return;
          of.matchingGrade = matchingGrade;
        });
      });
      toast({ title: "Grade updated" });
    },
  });

  return (
    <HandlersCtx.Provider value={{ onStarsToggled: mutation.mutate }}>
      <DataTable
        columns={opsColumns}
        data={tableData}
        renderSubComponent={({ row }) => (
          <DataTable columns={offersColumns} data={row.original.offers} />
        )}
      />
    </HandlersCtx.Provider>
  );
}

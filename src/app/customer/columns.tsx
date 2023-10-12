"use client";

import { createColumnHelper } from "@tanstack/react-table";
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

const opsHelper = createColumnHelper<OpsWithOffers>();

export const opsColumns = [
  opsHelper.accessor("id", {
    header: "ID",
    cell: ({ row, getValue }) => (
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
        <span>{getValue()}</span>
      </span>
    ),
  }),
  opsHelper.accessor("name", { header: "Name" }),
  opsHelper.accessor("status", { header: "Status" }),
  opsHelper.accessor("creationDate", {
    header: "Created at",
    cell: (x) => createDate(x.getValue()),
  }),
  opsHelper.accessor("validUntil", {
    header: "Valid until",
    cell: (x) => createDate(x.getValue()),
  }),
];

const offerHelper = createColumnHelper<Offer>();

type MutateStarsPayload = { id: string; matchingGrade: number };

type Ctx = {
  // eslint-disable-next-line no-unused-vars
  onStarsToggled: ({ id, matchingGrade }: MutateStarsPayload) => void;
};

export const HandlersCtx = React.createContext<Ctx>({ onStarsToggled: noop });

const Stars = ({
  offerId,
  matchingStars,
}: {
  offerId: string;
  matchingStars: Nullalble<number>;
}) => {
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
};

export const offersColumns = [
  offerHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => <span className="pr-[1.6rem]">{getValue()}</span>,
  }),
  offerHelper.accessor("matchingGrade", {
    header: "Grade",
    cell: ({ getValue, row }) => {
      return <Stars offerId={row.original.id} matchingStars={getValue()} />;
    },
  }),
  offerHelper.accessor("offerStatus", {
    header: "Status",
  }),
  offerHelper.accessor("creationDate", {
    header: "Created at",
    cell: (mg) => createDate(mg.getValue()),
  }),
  offerHelper.accessor("validUntil", {
    header: "Valid until",
    cell: (mg) => createDate(mg.getValue()),
  }),
];

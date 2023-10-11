"use client";

import {
  ColumnDef,
  ExpandedState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, HelpCircle, StarIcon } from "lucide-react";
import React from "react";
import { Offer, Opportunity, Prisma } from "@prisma/client";
import { Nullalble } from "@/types/shared";
import clsx from "clsx";

const opsWithOffers = Prisma.validator<Prisma.OpportunityArgs>()({
  include: { offers: true },
});

export type OpsWithOffers = Prisma.OpportunityGetPayload<typeof opsWithOffers>;

const chevronClasses = "h-4 w-4";

const createDate = (val: Nullalble<Date>) => (
  <th>
    {!val ? <HelpCircle className="h-4 w-4 cursor-pointer" /> : val.getTime()}
  </th>
);

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

const createStars = (matchingStars: Nullalble<number>) => {
  const orangeStars = !matchingStars ? 0 : matchingStars;
  return (
    <span className="flex">
      {Array(5)
        .fill(null)
        .map((_, ind) => (
          <StarIcon
            key={ind}
            className={clsx(
              "h-4 w-4 cursor-pointer",
              ind < orangeStars && "fill-orange-300",
            )}
          />
        ))}
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
    cell: (mg) => createStars(mg.getValue()),
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

"use client";

import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HelpCircle } from "lucide-react";
import React from "react";
import { Opportunity, Prisma } from "@prisma/client";

const missingDateExplainer = (val: unknown) =>
  (val as string) ?? <HelpCircle className="h-4 w-4 cursor-pointer" />;

const opsWithOffers = Prisma.validator<Prisma.OpportunityArgs>()({
  include: { offers: true },
});

export type OpsWithOffers = Prisma.OpportunityGetPayload<typeof opsWithOffers>;

export const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "id",
    header: "ID",

    cell: ({ row, getValue }) => (
      <>
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: () => row.toggleExpanded(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "👇" : "👉"}
          </button>
        ) : (
          "🔵"
        )}{" "}
        {getValue()}
      </>
    ),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "validUntil",
    header: "Valid until",
    cell: (props) => <th>{missingDateExplainer(props.getValue())}</th>,
  },
  {
    accessorKey: "creationDate",
    header: "Creation date",
    cell: (props) => <th>{missingDateExplainer(props.getValue())}</th>,
  },
];

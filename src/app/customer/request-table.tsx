"use client";

import { DataTable } from "@/components/data-table";
import { Opportunity } from "@prisma/client";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createDate } from "./shared";

const chevronClasses = "h-4 w-4";

export const opsColumns: ColumnDef<Opportunity>[] = [
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

export function RequestsTable({ requests }: { requests: Opportunity[] }) {
  return (
    <DataTable
      columns={opsColumns}
      data={requests}
      renderSubComponent={({ row }) => (
        <OffersTable opportunityId={row.original.id} />
      )}
    />
  );
}

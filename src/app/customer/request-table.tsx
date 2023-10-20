"use client";

import { DataTable } from "@/components/data-table";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createDate } from "./shared";
import { z } from "zod";
import { RequestModel } from "../../../prisma/zod";

const chevronClasses = "h-4 w-4";

type RequestSchemaLight = Pick<
  z.infer<typeof RequestModel>,
  "id" | "status" | "name" | "creationDate" | "validUntil"
>;

export const opsColumns: ColumnDef<RequestSchemaLight>[] = [
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

export function RequestsTable({
  requests,
}: {
  requests: RequestSchemaLight[];
}) {
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

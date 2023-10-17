"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import React from "react";
import { Opportunity } from "@prisma/client";
import { Nullalble } from "@/types/shared";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chevronClasses = "h-4 w-4";

export const createDate = (val: Nullalble<Date>) => {
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

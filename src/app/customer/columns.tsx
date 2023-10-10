"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Opportunity } from "../../../prisma/generated/zod";
import { HelpCircle } from "lucide-react";

const missingDateExplainer = (val: unknown) =>
  (val as string) ?? <HelpCircle className="h-4 w-4 cursor-pointer" />;

export const columns: ColumnDef<Opportunity>[] = [
  { accessorKey: "id", header: "ID" },
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

"use client";

import { DataTable } from "@/components/data-table";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { createDate } from "./shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { Action } from "@/types/shared";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ROUTES } from "@/lib/const";
import { Shell } from "@/components/shell";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { RequestPreview } from "@/types/request";

const chevronClasses = "h-4 w-4";

type RequestsPreviews = RouterOutputs["requestsPreviews"];

type Ctx = {
  handleRequestRemoval: Action<string>;
};

const ctx = React.createContext<Ctx>({} as Ctx);

export const opsColumns: ColumnDef<RequestsPreviews[0]>[] = [
  {
    accessorKey: "id",
    header: "Request ID",

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
    accessorKey: "offersCount",
    header: "Offers count",
    cell: ({ row }) => {
      const count = row.getValue("offersCount") as number;

      return count > 0 ? count : "-";
    },
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
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Cell id={row.original.id} />,
  },
];

function Cell({ id }: { id: string }) {
  const { handleRequestRemoval } = useContext(ctx);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={ROUTES.CUSTOMER.REQUESTS.ONE(id)}>Edit request</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRequestRemoval(id)}>
          Remove request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RequestsTable({ requests }: { requests: RequestPreview[] }) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data } = trpc.requestsPreviews.useQuery(undefined, {
    initialData: requests,
  });

  const { mutate: handleRequestRemoval } = trpc.requestDelete.useMutation({
    onError: () => {
      toast({
        title: "Request removal failed",
        description: "Try again later",
      });
    },
    onSuccess: (x) => {
      toast({ title: `Request ${x.name} removed successfully` });
      utils.requestsPreviews.invalidate();
    },
  });

  return (
    <ctx.Provider value={{ handleRequestRemoval }}>
      <Shell className="container pt-8">
        <DataTable
          columns={opsColumns}
          data={data || []}
          renderSubComponent={({ row }) => (
            <OffersTable opportunityId={row.original.id} />
          )}
        />
      </Shell>
    </ctx.Provider>
  );
}

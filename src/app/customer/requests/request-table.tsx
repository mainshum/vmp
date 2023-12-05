"use client";

import { DataTable } from "@/components/data-table";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { createDate } from "./shared";
import { z } from "zod";
import { RequestModel } from "zod-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { Action } from "@/types/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Request } from "@prisma/client";
import Link from "next/link";
import { ROUTES } from "@/lib/const";
import { RequestClient } from "@/lib/data";
import { Shell } from "@/components/shell";

const chevronClasses = "h-4 w-4";

type RequestSchemaLight = Pick<
  z.infer<typeof RequestModel>,
  "id" | "status" | "name" | "creationDate" | "validUntil"
>;

type Ctx = {
  handleRequestRemoval: Action<string>;
};

const ctx = React.createContext<Ctx>({} as Ctx);

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

type RequestTableRow = Pick<
  Request,
  "id" | "name" | "status" | "creationDate" | "validUntil"
>;

export function RequestsTable({ requests }: { requests: RequestTableRow[] }) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["customer", "requests"],
    initialData: requests,
    queryFn: () => RequestClient.getAll(),
    staleTime: 1000,
  });

  const { mutate: handleRequestRemoval } = useMutation({
    mutationFn: (id: string) => RequestClient.delete(id),
    onError: () => {
      toast({
        title: "Request removal failed",
        description: "Try again later",
      });
    },
    onSuccess: () => {
      toast({ title: "Request removed successfully" });
      queryClient.invalidateQueries({ queryKey: ["customer", "requests"] });
    },
  });

  return (
    <ctx.Provider
      value={{
        handleRequestRemoval,
      }}
    >
      <Shell className="container">
        <DataTable
          columns={opsColumns}
          data={data}
          renderSubComponent={({ row }) => (
            <OffersTable opportunityId={row.original.id} />
          )}
        />
      </Shell>
    </ctx.Provider>
  );
}

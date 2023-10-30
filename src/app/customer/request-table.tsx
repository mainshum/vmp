"use client";

import { DataTable } from "@/components/data-table";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { createDate } from "./shared";
import { z } from "zod";
import { RequestModel } from "../../../prisma/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { Action, Noop, Nullalble } from "@/types/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { RequestForm } from "@/components/create-request";
import { Request } from "@prisma/client";
import { match } from "ts-pattern";
import { delay } from "@/lib/utils";
import { flushSync } from "react-dom";

const chevronClasses = "h-4 w-4";

type RequestSchemaLight = Pick<
  z.infer<typeof RequestModel>,
  "id" | "status" | "name" | "creationDate" | "validUntil"
>;

type Ctx = {
  handleRequestRemoval: Action<string>;
  handleRequestEdit: Action<string>;
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
  const { handleRequestRemoval, handleRequestEdit } = useContext(ctx);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRequestEdit(id)}>
          Edit request
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRequestRemoval(id)}>
          Remove request
        </DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type RequestEdit =
  | { type: "none" }
  | { type: "new" }
  | { type: "edit"; data: Request };

export function RequestsTable({ requests }: { requests: Request[] }) {
  const queryClient = useQueryClient();

  const [edited, setEdited] = React.useState<RequestEdit>({ type: "none" });

  const { toast } = useToast();

  const { data } = useQuery<Request[]>({
    queryKey: ["requests"],
    initialData: requests,
    queryFn: async () => await (await fetch(`/api/requests`)).json(),
    staleTime: 1000,
  });

  const { mutate: handleRequestRemoval } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/requests?id=${id}`, {
        method: "DELETE",
      });

      if (res.status !== 200) throw new Error("Delete failed");
    },
    onError: () => {
      toast({
        title: "Request removal failed",
        description: "Try again later",
      });
    },
    onSuccess: () => {
      toast({ title: "Request removed successfully" });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const handleRequestEdit = (id: string) => {
    document.body.style.pointerEvents = "initial";

    setEdited({
      type: "edit",
      data: data.find((d) => d.id === id)!,
    });
  };

  const handleFormCloseRequest = () => {
    setEdited({ type: "none" });
  };

  return (
    <ctx.Provider
      value={{
        handleRequestRemoval,
        handleRequestEdit,
      }}
    >
      <Button onClick={() => setEdited({ type: "new" })}>
        Create new request
      </Button>
      {match(edited)
        .with({ type: "none" }, () => null)
        .with({ type: "edit" }, ({ data }) => (
          <RequestForm request={data} onCloseRequest={handleFormCloseRequest} />
        ))
        .with({ type: "new" }, () => (
          <RequestForm onCloseRequest={handleFormCloseRequest} />
        ))
        .exhaustive()}
      <DataTable
        columns={opsColumns}
        data={data}
        renderSubComponent={({ row }) => (
          <OffersTable opportunityId={row.original.id} />
        )}
      />
    </ctx.Provider>
  );
}

"use client";
import { produce } from "immer";

import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HandlersCtx,
  OpsWithOffers,
  offersColumns,
  opsColumns,
} from "./columns";
import React, { useState } from "react";
import { Offer } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { OfferSchema } from "zod-types";

function OffersTable({ offers }: { offers: Offer[] }) {
  const table = useReactTable({
    data: offers,
    columns: offersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className="font-bold text-foreground"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
              There are no offers for this opportunity yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const toggleStars = ({
  id,
  matchingGrade,
}: {
  id: string;
  matchingGrade: number;
}) =>
  fetch("/api/offer", {
    method: "PUT",
    body: JSON.stringify({ id, matchingGrade }),
  });

export function OpportunityTable({ data }: { data: OpsWithOffers[] }) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const { toast } = useToast();

  const [tableData, setTableData] = useState(data);

  const table = useReactTable({
    data: tableData,
    columns: opsColumns,
    state: {
      expanded,
    },
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
  });

  const mutation = useMutation({
    mutationFn: toggleStars,
    onSuccess: async (res) => {
      if (res.status !== 200)
        return toast({
          title: "Something went wrong",
          description: "Grade was not updated",
          variant: "destructive",
        });

      // TODO log unexpected response
      const { id, matchingGrade, opportunityId } = OfferSchema.pick({
        id: true,
        matchingGrade: true,
        opportunityId: true,
      }).parse(await res.json());

      setTableData((cur) => {
        return produce(cur, (draft) => {
          const op = draft.find((op) => op.id === opportunityId);
          if (!op) return;
          const of = op.offers.find((of) => of.id === id);
          if (!of) return;
          of.matchingGrade = matchingGrade;
        });
      });
      toast({ title: "Grade updated" });
    },
  });

  return (
    <HandlersCtx.Provider value={{ onStarsToggled: mutation.mutate }}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={{ width: header.getSize() }}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell
                      className="p-0"
                      colSpan={table.getAllColumns().length}
                    >
                      <OffersTable offers={row.original.offers} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </HandlersCtx.Provider>
  );
}

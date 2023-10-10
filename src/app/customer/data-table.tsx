"use client";

import {
  ExpandedState,
  Table,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table as T,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OpsWithOffers, columns } from "./columns";
import React from "react";
import { Opportunity } from "@prisma/client";

interface DataTableProps<TData> {
  table: Table<TData>;
}

export function OpsTable({ data }: { data: Opportunity[] }) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <T>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
              <>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <>
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    </>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell
                      className="p-0"
                      colSpan={table.getAllColumns().length}
                    >
                      <T>
                        <TableHeader>
                          <TableHead>ID</TableHead>
                          <TableHead>stars</TableHead>
                          <TableHead>stars</TableHead>
                          <TableHead>stars</TableHead>
                          <TableHead>stars</TableHead>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>a</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>3</TableCell>
                          </TableRow>
                        </TableBody>
                      </T>
                    </TableCell>
                  </TableRow>
                )}
              </>
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
      </T>
    </div>
  );
}

"use client";

import {
  ColumnDef,
  Row,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // eslint-disable-next-line no-unused-vars
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  tableOptions?: Omit<
    TableOptions<TData>,
    "data" | "columns" | "getCoreRowModel"
  >;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
  tableOptions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    ...tableOptions,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
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
            <React.Fragment key={row.id}>
              <TableRow data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, {
                      ...cell.getContext(),
                      dupa: 13,
                    })}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && renderSubComponent && (
                <TableRow>
                  <TableCell
                    className="p-0"
                    colSpan={table.getAllColumns().length}
                  >
                    {renderSubComponent({ row })}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

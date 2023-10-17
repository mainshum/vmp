"use client";

import { DataTable } from "@/components/data-table";
import { Opportunity } from "@prisma/client";
import { opsColumns } from "./columns";
import { OffersTable } from "./offers-table";

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

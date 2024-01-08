"use client";

import { DataTable } from "@/components/data-table";
import { OffersTable } from "./offers-table";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
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
import { RouterOutputs, RouterInputs, trpc } from "@/lib/trpc";
import { createDate } from "./shared";
import { RequestStatus } from "@prisma/client";

const chevronClasses = "h-4 w-4";

type CustomerRequests = RouterOutputs["CLIENT"]["requests"];
type VendorRequests = RouterOutputs["VENDOR"]["requests"];
type AdminRequests = RouterOutputs["ADMIN"]["requests"];
type RouterX = RouterInputs['ADMIN']['updateStatus'];

type ActionsContext = {
  handleRequestRemoval?: Action<string>;
  onStatusChange?: Action<RouterX>;
  enableOffering: boolean;
  enableEditing: boolean;
};

const ctx = React.createContext<ActionsContext>({} as ActionsContext);

type SharedColumns = Pick<
  CustomerRequests[0],
  "name" | "id" | "validUntil" | "creationDate"
>;

const sharedColumns: ColumnDef<SharedColumns>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
    cell: ({ row }) => {
      return (
        <span className="flex gap-2">
          <button className="cursor-pointer">
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

type UnwrapColDef<T> = T extends ColumnDef<infer R> ? R : never;

const customerColumnns: ColumnDef<CustomerRequests[0]>[] = [
  ...(sharedColumns as UnwrapColDef<(typeof sharedColumns)[0]>[]),
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
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <CustomerActions status={row.original.status} id={row.original.id} />,
  },
];

const vendorColumns: ColumnDef<VendorRequests[0]>[] = [
  ...sharedColumns,
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <CustomerActions id={row.original.id} />,
  },
];

const adminColumns = [
  customerColumnns[0],
  {
    accessorKey: "userId",
    header: "Creator ID",
  },
  ...customerColumnns.slice(1),
];

const statusesOrder: RequestStatus[] = [
  "DRAFT",
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CLOSED",
];

const AdminActions = ({
  onStatusChange,
  status,
}: {
  onStatusChange: Action<RequestStatus>;
  status: RequestStatus;
}) => {
  const ind = statusesOrder.findIndex((x) => x === status);

  return (
    <>
      {ind >= 1 && (
        <DropdownMenuItem
          onClick={() => onStatusChange(statusesOrder[ind - 1])}
        >
          Downgrade status to {statusesOrder[ind - 1]}
        </DropdownMenuItem>
      )}
      {statusesOrder[ind + 1] && (
        <DropdownMenuItem
          onClick={() => onStatusChange(statusesOrder[ind + 1])}
        >
          Advance status to {statusesOrder[ind + 1]}
        </DropdownMenuItem>
      )}
    </>
  );
};

function CustomerActions({
  id,
  status,
}: {
  id: string;
  status?: RequestStatus;
}) {
  const {
    handleRequestRemoval,
    enableOffering,
    enableEditing,
    onStatusChange,
  } = useContext(ctx);

  return (
    <div onClick={e => e.stopPropagation()}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onStatusChange && status && (
          <AdminActions onStatusChange={(newStatus) => onStatusChange({id, newStatus})} status={status} />
        )}
        {enableEditing && (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.REQUESTS.ONE(id)}>Edit request</Link>
          </DropdownMenuItem>
        )}

        {handleRequestRemoval && (
          <DropdownMenuItem onClick={() => handleRequestRemoval(id)}>
            Remove request
          </DropdownMenuItem>
        )}
        {enableOffering && (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.OFFERS.CREATE(id)}>Make offer</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
</div>
  );
}

export function Customer({ requests }: { requests: CustomerRequests }) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const client = trpc.CLIENT;

  const { data } = client.requests.useQuery(undefined, {
    initialData: requests,
  });

  const { mutate: handleRequestRemoval } = client.requestDelete.useMutation({
    onError: () => {
      toast({
        title: "Request removal failed",
        description: "Try again later",
      });
    },
    onSuccess: (x) => {
      toast({ title: `Request ${x.name} removed successfully` });
      utils.CLIENT.requests.invalidate();
    },
  });

  return (
    <ctx.Provider
      value={{
        handleRequestRemoval,
        enableOffering: false,
        enableEditing: true,
      }}
    >
      <DataTable
        columns={customerColumnns}
        data={data || []}
        renderSubComponent={({ row }) => (
          <OffersTable opportunityId={row.original.id} />
        )}
      />
    </ctx.Provider>
  );
}

const vendorOptions = { enableOffering: true, enableEditing: false };

export function Vendor({ requests }: { requests: VendorRequests }) {
  const client = trpc.VENDOR;

  const { data } = client.requests.useQuery(undefined, {
    initialData: requests,
  });

  return (
    <ctx.Provider value={vendorOptions}>
      <DataTable
        columns={vendorColumns}
        data={data || []}
        renderSubComponent={({ row }) => (
          <OffersTable opportunityId={row.original.id} />
        )}
      />
    </ctx.Provider>
  );
}

export function Admin({ requests }: { requests: AdminRequests }) {
  const client = trpc.CLIENT;

  const utils = trpc.useUtils();

  const { data } = client.requests.useQuery(undefined, {
    initialData: requests,
  });

  const {toast} = useToast();

  const {mutate} = trpc.ADMIN.updateStatus.useMutation({
    onMutate({newStatus}) {
      toast({title: `Changing status to ${newStatus}`});
    },
    onError() {
      toast({title: 'Error changing status'})
    },
    onSuccess({status, name}) {
      utils.CLIENT.requests.invalidate();
      toast({title: `Request ${name}: status changed to ${status}`});
    }
  })

  return (
    <ctx.Provider
      value={{
        enableOffering: true,
        enableEditing: true,
        onStatusChange: ({id, newStatus}) => {
          const answer = confirm(`This action will change request's status to ${newStatus}. Are you sure?`)
          if (!answer) return;

          mutate({id, newStatus});
        },
      }}
    >
      <DataTable
        columns={adminColumns}
        onRowClick={(row) => row.toggleExpanded()}
        data={data || []}
        renderSubComponent={({ row }) => (
          <OffersTable opportunityId={row.original.id} />
        )}
      />
    </ctx.Provider>
  );
}

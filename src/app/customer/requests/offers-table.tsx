"use client";

import { DataTable } from "@/components/data-table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { createContext, useContext, useState } from "react";
import { cn, noop, withMinResolveTime } from "@/lib/utils";
import { Nullalble } from "@/types/shared";
import { Loader2, StarIcon } from "lucide-react";
import { createDate } from "./shared";
import { z } from "zod";
import { produce } from "immer";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { OfferSchema } from "@/types/prisma-types";

type MutateStarsPayload = { id: string; matchingGrade: number };

type Ctx = {
  // eslint-disable-next-line no-unused-vars
  onStarsToggled: ({ id, matchingGrade }: MutateStarsPayload) => void;
};

const HandlersCtx = createContext<Ctx>({ onStarsToggled: noop });

function Stars({
  offerId,
  matchingStars,
}: {
  offerId: string;
  matchingStars: Nullalble<number>;
}) {
  const orangeStars = !matchingStars ? 0 : matchingStars;

  const [hoverInd, setHoverInd] = useState<Nullalble<number>>(null);

  const { onStarsToggled } = useContext(HandlersCtx);

  return (
    <span className="flex">
      {Array(5)
        .fill(null)
        .map((_, ind) => {
          const starNo = ind + 1;
          return (
            <StarIcon
              key={ind}
              onMouseOver={() => setHoverInd(starNo)}
              onMouseOut={() => setHoverInd(null)}
              onClick={() => {
                if (orangeStars === starNo) return;
                onStarsToggled({ id: offerId, matchingGrade: starNo });
              }}
              className={cn(
                "h-4 w-4 cursor-pointer",
                starNo <= orangeStars && "fill-orange-200",
                hoverInd && starNo <= hoverInd && "fill-orange-300",
              )}
            />
          );
        })}
    </span>
  );
}

type OfferSchema = z.infer<typeof OfferSchema>;

const offersColumns: ColumnDef<OfferSchema>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="pr-[1.6rem]">{row.getValue("id")}</span>
    ),
  },
  {
    header: "Grade",
    accessorKey: "matchingGrade",
    cell: ({ row }) => {
      return (
        <Stars
          offerId={row.original.id}
          matchingStars={row.getValue("matchingGrade")}
        />
      );
    },
  },
  {
    accessorKey: "offerStatus",
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
const toggleStars = ({
  id,
  matchingGrade,
}: {
  id: string;
  matchingGrade: number;
}) =>
  fetch(`/api/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, matchingGrade }),
  });

const getOffers = withMinResolveTime(250, (opId: string) =>
  fetch(`/api/offers/${opId}`)
    .then((res) => res.json())
    .then((json) => z.array(OfferSchema).parse(json)),
);

export function OffersTable({
  opportunityId: opId,
}: {
  opportunityId: string;
}) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const key = ["offers", opId];

  const { data } = useQuery({
    queryFn: () => getOffers(opId),
    queryKey: key,
    placeholderData: (d) => d,
  });

  const [divRef] = useAutoAnimate();

  const mutation = useMutation({
    mutationFn: toggleStars,
    onMutate: async ({ id, matchingGrade }) => {
      await queryClient.cancelQueries({ queryKey: key });

      const current = queryClient.getQueryData(key);

      queryClient.setQueryData<OfferSchema[]>(key, (ops) =>
        produce(ops, (xs) => {
          if (!xs) return;
          const offer = xs.find((d) => d.id === id);
          if (!offer) return;
          offer.matchingGrade = matchingGrade;
        }),
      );

      return { current };
    },
    // eslint-disable-next-line no-unused-vars
    onError: (_a, _b, ctx) => {
      // TODO onError
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast({ title: "Grade updated" });
    },
  });

  return (
    <HandlersCtx.Provider value={{ onStarsToggled: mutation.mutate }}>
      <div ref={divRef}>
        {data ? (
          <DataTable columns={offersColumns} data={data} />
        ) : (
          <div className="flex items-center justify-center gap-2 p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Loading offers</span>
          </div>
        )}
      </div>
    </HandlersCtx.Provider>
  );
}

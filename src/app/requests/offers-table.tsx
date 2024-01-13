"use client";

import { produce } from "immer";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React, { useContext, useState } from "react";
import { cn, reduceSum } from "@/lib/utils";
import { Nullalble } from "@/types/shared";
import { FileText, Loader2, MoreHorizontal, StarIcon } from "lucide-react";
import { createDate } from "./shared";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { ROUTES } from "@/lib/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OfferGrade } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

type ActionsContext = {
  // eslint-disable-next-line no-unused-vars
  handleOfferRemoval?: (offerId: string) => void;
  // eslint-disable-next-line no-unused-vars
  toggleRatingDetails: (offerId: string) => void;
  enableEditing: boolean;
  // eslint-disable-next-line no-unused-vars
  starsIdOpened: Nullalble<string>;
};

const ctx = React.createContext<ActionsContext>({} as ActionsContext);

// eslint-disable-next-line no-unused-vars
const Stars = ({
  stars,
  onStarsToggle,
}: {
  stars: number;
  // eslint-disable-next-line no-unused-vars
  onStarsToggle?: (stars: number) => void;
}) => (
  <span className="flex">
    {Array(5)
      .fill(null)
      .map((_, ind) => {
        const starNo = ind + 1;
        return (
          <StarIcon
            key={ind}
            onClick={() => onStarsToggle?.(starNo)}
            className={cn(
              "h-4 w-4",
              starNo <= stars && "fill-orange-200",
              onStarsToggle && [
                "cursor-pointer",
                "hover:fill-orange-400",
                "has-[~:hover]:fill-orange-400",
              ],
            )}
          />
        );
      })}
  </span>
);

const OfferRatings = ({
  offerGrade,
  offerId,
}: {
  offerGrade: OfferGrade;
  offerId: string;
}) => {
  const { starsIdOpened } = useContext(ctx);

  const offerGradeId = offerGrade.id;
  const utils = trpc.useUtils();

  const { data } = trpc.offer.offerGrade.useQuery(offerGradeId, {
    initialData: offerGrade,
    staleTime: 1000,
  });

  const { toast } = useToast();

  const { mutate: onStarsToggled } = trpc.offer.setStars.useMutation({
    onMutate({ starType, stars }) {
      utils.offer.offerGrade.setData(
        offerGradeId,
        produce((draft) => {
          if (!draft) return;
          draft[starType] = stars;
        }),
      );

      return offerGrade;
    },
    onError(error, vars, ctx) {
      toast({ title: "Unexpected error occured" });
      utils.offer.offerGrade.setData(offerGradeId, () => ctx);
    },
    onSettled() {
      utils.offer.offerGrade.invalidate(offerGradeId);
    },
  });

  if (!data) return null;

  return (
    <section className="flex flex-col gap-4">
      {starsIdOpened === offerId ? (
        <>
          <span>Logistics fit</span>
          <Stars
            onStarsToggle={(s) =>
              onStarsToggled({
                offerGradeId,
                stars: s,
                starType: "n_logistics",
              })
            }
            stars={data.n_logistics}
          />
          <span>Rate fit</span>
          <Stars
            onStarsToggle={(s) =>
              onStarsToggled({
                offerGradeId,
                stars: s,
                starType: "n_rateFit",
              })
            }
            stars={data.n_rateFit}
          />
          <span>Seniority fit</span>
          <Stars
            onStarsToggle={(s) =>
              onStarsToggled({
                offerGradeId,
                stars: s,
                starType: "n_seniorityFit",
              })
            }
            stars={data.n_seniorityFit}
          />
          <span>Technology fit</span>
          <Stars
            onStarsToggle={(s) =>
              onStarsToggled({
                offerGradeId,
                stars: s,
                starType: "n_technologyFit",
              })
            }
            stars={data.n_technologyFit}
          />
          <span>Vendor score</span>
          <Stars
            onStarsToggle={(s) =>
              onStarsToggled({
                offerGradeId,
                stars: s,
                starType: "n_vendorScore",
              })
            }
            stars={data.n_vendorScore}
          />
        </>
      ) : (
        (() => {
          const stars = [
            data.n_logistics,
            data.n_rateFit,
            data.n_seniorityFit,
            data.n_technologyFit,
            data.n_vendorScore,
          ];

          const avgGrade = stars.reduce(reduceSum) / stars.length;

          return <Stars stars={avgGrade} />;
        })()
      )}
    </section>
  );
};

type OfferSchema = RouterOutputs["offer"]["offers"][0];

const PDFFile = ({ offerId, cv }: { offerId: string; cv: string }) => {
  const downloadCV = () => {
    const linkSource = cv;
    const downloadLink = document.createElement("a");
    const fileName = "CV.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return <FileText className="h-4 w-4 cursor-pointer" onClick={downloadCV} />;
};

function Actions({ offerId }: { offerId: string }) {
  const { enableEditing, handleOfferRemoval, toggleRatingDetails } =
    useContext(ctx);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleRatingDetails(offerId)}>
          Toggle rating details
        </DropdownMenuItem>
        {handleOfferRemoval && (
          <DropdownMenuItem onClick={() => handleOfferRemoval(offerId)}>
            Remove offer
          </DropdownMenuItem>
        )}
        {enableEditing && (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.OFFERS.EDIT(offerId)}>View offer</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const offersColumns: ColumnDef<OfferSchema>[] = [
  {
    accessorKey: "id",
    header: "Offer ID",
    cell: ({ row }) => (
      <span className="pr-[1.6rem]">{row.getValue("id")}</span>
    ),
  },
  {
    header: "Grade",
    accessorKey: "offerGrade",
    cell: ({ row }) => {
      return (
        <OfferRatings
          offerId={row.getValue("id")}
          offerGrade={row.getValue("offerGrade") as OfferGrade}
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
  {
    accessorKey: "cv",
    header: "CV",
    cell: ({ row }) => {
      return <PDFFile offerId={row.original.id} cv={row.getValue("cv")} />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions offerId={row.original.id} />,
  },
];

// admin and vendor
export function OffersTable({
  opportunityId: opId,
}: {
  opportunityId: string;
}) {
  const [starsIdOpened, setStarsIdOpened] = useState<Nullalble<string>>(null);
  const { data } = trpc.offer.offers.useQuery(opId);

  const utils = trpc.useUtils();

  const [divRef] = useAutoAnimate();

  const toggleRatingDetails = (offerId: string) =>
    setStarsIdOpened((currentlyToggled) => {
      if (currentlyToggled === offerId) return null;

      return offerId;
    });

  // const { mutate: setStars } = trpc.offer.setStars.useMutation({
  //   onSettled(data) {
  //     utils.offer.offers.setData(
  //       opId,
  //       produce((draft) => {
  //         if (!data?.offer) return;
  //         draft!.find((o) => o.id === data.offer!.id)!.offerGrade = data;
  //       }),
  //     );
  //   },
  // });

  return (
    <ctx.Provider
      value={{
        enableEditing: true,
        toggleRatingDetails,
        starsIdOpened,
      }}
    >
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
    </ctx.Provider>
  );
}

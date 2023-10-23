import { db } from "@/lib/db";
import { RequestModelPayload } from "@/types/prisma-types";
import { match } from "ts-pattern";
import { RequestModel } from "../../../../../prisma/zod/request";
import { z } from "zod";

type Mapped = Pick<
  z.infer<typeof RequestModel>,
  "workType" | "officeLocation" | "daysInOffice"
>;

export async function POST(req: Request) {
  const parsed = RequestModelPayload.safeParse(await req.json());

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);
    return new Response(errorTxt, {
      status: 404,
    });
  }
  const { data } = parsed;

  const mapped: Mapped = match(data.workType)
    .with(
      { workType: "FULLY_REMOTE" },
      ({ workType }): Mapped => ({ workType }),
    )
    .with(
      { workType: "HYBRID" },
      ({ daysInOffice, officeLocation, workType }): Mapped => ({
        officeLocation,
        daysInOffice,
        workType,
      }),
    )
    .with(
      { workType: "ONSITE" },
      ({ officeLocation, workType }): Mapped => ({ officeLocation, workType }),
    )
    .exhaustive();

  const updated = await db.request.create({
    data: { ...data, ...mapped },
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

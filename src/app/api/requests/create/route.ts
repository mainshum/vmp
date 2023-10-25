import { db } from "@/lib/db";
import { requestPayloadBody } from "@/types/prisma-types";
import { match } from "ts-pattern";
import { Request as R } from "@prisma/client";

export async function POST(req: Request) {
  const parsed = requestPayloadBody.safeParse(await req.json());

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);
    return new Response(errorTxt, {
      status: 404,
    });
  }
  const { data } = parsed;

  const workSchema: Record<string, string> = match(data.workSchema)
    .with(undefined, () => ({}))
    .with({ workType: "FULLY_REMOTE" }, ({ workType }) => ({ workType }))
    .with(
      { workType: "HYBRID" },
      ({ daysInOffice, officeLocation, workType }) => ({
        officeLocation,
        daysInOffice,
        workType,
      }),
    )
    .with({ workType: "ONSITE" }, ({ officeLocation, workType }) => ({
      officeLocation,
      workType,
    }))
    .exhaustive();

  delete data.workSchema;

  const input: Partial<R> & { status: "DRAFT" | "PENDING" } = {
    ...data,
    ...workSchema,
  };

  const updated = await db.request.create({
    data: input,
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

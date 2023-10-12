import { getVMPSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { OfferSchema } from "zod-types";

// update offer
export async function PUT(req: Request) {
  const [session, body] = await Promise.all([getVMPSession(), req.json()]);

  console.log(session);

  if (!session) return NextResponse.json("Not signed in", { status: 401 });

  const parsed = OfferSchema.omit({ opportunityId: true }).safeParse(body);

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);

    return new Response(errorTxt, {
      status: 404,
    });
  }

  const { data } = parsed;

  const updated = await db.offer.update({
    data: data,
    where: { id: data.id },
    select: {
      id: true,
      matchingGrade: true,
      opportunityId: true,
    },
  });

  return new Response(JSON.stringify(updated));
}

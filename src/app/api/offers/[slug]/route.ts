import { getVMPSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { OfferSchema } from "zod-types";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getVMPSession();

  if (!session) return NextResponse.json("Not signed in", { status: 401 });

  const parsed = z.string().safeParse(params.slug);

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);

    return new Response(errorTxt, {
      status: 404,
    });
  }

  const data = await db.offer.findMany({
    where: { opportunityId: parsed.data },
    orderBy: { id: "asc" },
  });

  return new Response(JSON.stringify(data));
}

// update offer
export async function PUT(req: Request) {
  const [session, body] = await Promise.all([getVMPSession(), req.json()]);

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

import { db } from "@/lib/db";
import { draftSchema, PendingRequest } from "@/types/prisma-types";
import { RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

type ReqParams = { params: { reqId: string } };

export async function GET(_req: NextRequest, { params }: ReqParams) {
  const data = await db.request.findFirst({
    where: { id: params.reqId },
  });

  return new Response(JSON.stringify(data));
}

export async function PUT(req: NextRequest, { params }: ReqParams) {
  const body = await req.json();

  const status = z
    .object({
      status: z.nativeEnum(RequestStatus),
    })
    .safeParse(body);

  if (!status.success)
    return new Response(status.error.message, {
      status: 404,
    });

  const data =
    status.data.status === "DRAFT"
      ? draftSchema.safeParse(body)
      : PendingRequest.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.update({
    where: { id: params.reqId },
    data: { ...data.data, status: status.data.status },
    select: { name: true, id: true },
  });

  return new Response(JSON.stringify(updated));
}

export async function DELETE(req: NextRequest, { params }: ReqParams) {
  await db.request.delete({
    where: { id: params.reqId },
  });

  return new Response();
}

import { db } from "@/lib/db";
import { RequestFormModel } from "@/types/request";
import { NextRequest } from "next/server";

type ReqParams = { params: { reqId: string } };

export async function GET(_req: NextRequest, { params }: ReqParams) {
  const data = await db.request.findFirst({
    where: { id: params.reqId },
  });

  return new Response(JSON.stringify(data));
}

export async function PUT(req: NextRequest, { params }: ReqParams) {
  const body = await req.json();

  const data = RequestFormModel.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.update({
    where: { id: params.reqId },
    data: data.data,
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

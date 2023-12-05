import { db } from "@/lib/db";
import { draftSchema, RequestFormModel } from "@/types/prisma-types";
import { RequestStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const idParser = z.string().cuid();

export async function GET() {
  const data = await db.request.findMany();

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
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
      : RequestFormModel.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.create({
    data: { ...data.data, status: status.data.status },
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const id = idParser.safeParse(req.nextUrl.searchParams.get("id"));

  if (!id.success)
    return new Response("Incorrect request body", {
      status: 404,
    });
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
      : RequestFormModel.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.update({
    where: { id: id.data },
    data: { ...data.data, status: status.data.status },
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  const parsed = idParser.safeParse(id);

  if (!parsed.success)
    return new Response(JSON.stringify(parsed.error.issues, null, 2), {
      status: 404,
    });

  await db.request.delete({
    where: { id: parsed.data },
  });

  return new Response();
}

import { db } from "@/lib/db";
import { draftRequestSchema, pendingRequestSchema } from "@/types/prisma-types";
import { NextRequest } from "next/server";
import { z } from "zod";

const parser = pendingRequestSchema.or(draftRequestSchema);
const idParser = z.string().cuid();

export async function GET() {
  const data = await db.request.findMany();

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = parser.safeParse(body);

  if (!parsed.success)
    return new Response(JSON.stringify(parsed.error.issues, null, 2), {
      status: 404,
    });

  // eslint-disable-next-line no-unused-vars
  const data = (({ workSchema, ...xs }) => ({ ...xs }))(parsed.data);

  const updated = await db.request.create({
    data,
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const id = idParser.safeParse(req.nextUrl.searchParams.get("id"));

  if (!id.success)
    return new Response(JSON.stringify({ error: "ID missing" }), {
      status: 404,
    });

  const parsed = parser.safeParse(body);

  if (!parsed.success)
    return new Response(JSON.stringify(parsed.error.issues, null, 2), {
      status: 404,
    });

  // eslint-disable-next-line no-unused-vars
  const data = (({ workSchema, ...xs }) => ({ ...xs }))(parsed.data);

  const updated = await db.request.update({
    where: { id: id.data },
    data,
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

import { db } from "@/lib/db";
import { RequestPostModel } from "@/types/request";
import { Prisma } from "@prisma/client";

export async function GET() {
  const data = await db.request.findMany();

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const body = await req.json();

  const data = RequestPostModel.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.create({
    data: {
      ...data.data,
      creationDate: new Date(),
      validUntil: new Date(),
      technical: !data.data.technical ? Prisma.DbNull : data.data.technical,
    },
  });

  return new Response(JSON.stringify(updated));
}

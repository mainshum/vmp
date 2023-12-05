import { db } from "@/lib/db";
import { RequestFormModel } from "@/types/request";

export async function GET() {
  const data = await db.request.findMany();

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const body = await req.json();

  const data = RequestFormModel.safeParse(body);

  if (!data.success)
    return new Response(data.error.message, {
      status: 404,
    });

  const updated = await db.request.create({
    data: {
      ...data.data,
      creationDate: new Date(),
      validUntil: new Date(),
    },
    select: { name: true, id: true },
  });

  return new Response(JSON.stringify(updated));
}

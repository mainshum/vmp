import { db } from "@/lib/db";
import { RequestModel } from "../../../../../prisma/zod";

export async function PUT(req: Request) {
  const parsed = RequestModel.safeParse(req.body);

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);
    return new Response(errorTxt, {
      status: 404,
    });
  }
  const { data } = parsed;

  const updated = await db.request.create({
    data: data,
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

import { db } from "@/lib/db";
import { RequestModelPayload } from "@/types/prisma-extensions";

export async function POST(req: Request) {
  const parsed = RequestModelPayload.safeParse(await req.json());

  if (!parsed.success) {
    const errorTxt = JSON.stringify(parsed.error.issues, null, 2);
    return new Response(errorTxt, {
      status: 404,
    });
  }
  const { data } = parsed;

  const updated = await db.request.create({
    data: { ...data },
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

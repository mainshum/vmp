import { db } from "@/lib/db";
import { draftRequestSchema, pendingRequestSchema } from "@/types/prisma-types";

const parser = pendingRequestSchema.or(draftRequestSchema);

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = parser.safeParse(body);

  if (!parsed.success)
    return new Response(JSON.stringify(parsed.error.issues, null, 2), {
      status: 404,
    });

  const data = (({ workSchema, ...xs }) => ({ ...xs }))(parsed.data);

  const updated = await db.request.create({
    data,
    select: { name: true },
  });

  return new Response(JSON.stringify(updated));
}

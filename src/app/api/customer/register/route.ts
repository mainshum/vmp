import { db } from "@/lib/db";
import { CustomerModel } from "../../../../../prisma/zod/customer";

// register user as client
export async function POST(req: Request) {
  const parsed = CustomerModel.safeParse(await req.json());

  if (!parsed.success)
    return new Response(JSON.stringify({ errors: parsed.error.errors }), {
      status: 404,
    });

  try {
    const [{ id }] = await Promise.all([
      db.customer.create({ data: parsed.data, select: { id: true } }),
      db.user.update({
        where: { id: parsed.data.id },
        data: { role: "CLIENT" },
      }),
    ]);

    return new Response(JSON.stringify({ id }));
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 404 });
  }
}

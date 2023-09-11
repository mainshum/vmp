import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// register user as client
export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch {
    return new Response("Body should be a JSON object", { status: 400 });
  }

  try {
    await Promise.all([
      db.user.update({
        where: { id: data.id },
        data: { role: "CLIENT" },
      }),
      db.customer.create({
        data: data,
      }),
    ]);

    return NextResponse.json({ userId: data.id });
  } catch (err) {
    return NextResponse.json({ errors: err }, { status: 422 });
  }
}

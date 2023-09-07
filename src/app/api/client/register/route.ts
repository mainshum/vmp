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
    const { id } = await db.customer.create({ data, select: { id: true } });
    return NextResponse.json({ id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ errors: err }, { status: 422 });
  }
}

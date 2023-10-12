import { getVMPSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFileSync } from "fs";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getVMPSession();

  if (!session) return NextResponse.json("Not signed in", { status: 401 });

  const data = await db.customer.findFirst({
    where: { id: session.user.id },
  });

  return NextResponse.json(data);
}

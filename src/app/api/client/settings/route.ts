import { getVMPSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFileSync } from "fs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const a = {
  authority: "lh3.googleusercontent.com",
  "content-type": "application/json",
  "next-url": "/client/settings",
  origin: "http://localhost:3000",
  "postman-token": "8f31f776-e67a-49a1-b5d8-6ddec01dc8f1",
  referer: "http://localhost:3000/",
  "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
  "sec-websocket-key": "ccPpQLypZlbWM1kuxpIr8A==",
  "sec-websocket-version": "13",
  upgrade: "websocket",
  "x-client-data":
    "CIy2yQEIpLbJAQipncoBCI6PywEIk6HLAQjTmM0BCIagzQEIu8jNAQi5ys0BCJPPzQE=",
};

export async function GET() {
  const session = await getVMPSession();

  if (!session) return NextResponse.json("Not signed in", { status: 401 });

  const data = await db.customer.findFirst({
    where: { id: session.user.id },
  });

  return NextResponse.json(data);
}

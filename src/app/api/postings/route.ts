import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mockState = searchParams.get("mockstate");

  if (mockState === "error")
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );

  return NextResponse.json(
    Array(10)
      .fill(null)
      .map((_, ind) => ({
        name: `Posting ${ind}`,
        number: `${ind}`,
        offers: Math.floor(Math.random() * 10),
        status: "new",
      })),
  );
}

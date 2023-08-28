import { MOCK_STATE_HEADER } from "@/lib/const";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const hs = req.headers;

  if (hs.get(MOCK_STATE_HEADER) === "ERROR")
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );

  return NextResponse.json(
    Array(10)
      .fill(null)
      .map((_, ind) => ({
        name: `Postingidjsfksdjfkljsdkfjsdkljfkl ${ind}`,
        number: `${ind}`,
        offers: Math.floor(Math.random() * 10),
        status: "new",
      })),
  );
}

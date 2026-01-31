import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3000/api/cart";

/* GET ALL CART ITEMS */
export async function GET() {
  const res = await fetch(BACKEND_URL, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data);
}

/* ADD TO CART */
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}

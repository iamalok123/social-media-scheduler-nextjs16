import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Channel disconnection is not configured yet" },
    { status: 501 },
  );
}

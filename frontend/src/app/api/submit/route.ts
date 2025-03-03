import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data: Record<string, unknown> = await request.json(); // Ensures data is a valid object

    // TODO: Store data in Amazon RDS (PostgreSQL)

    return NextResponse.json({ message: "Submission successful!", receivedData: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}
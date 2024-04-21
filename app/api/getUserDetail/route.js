import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const request = await req.json();
    const result =
      await sql`select * from user_details where user_id = ${request.id}`;

    return NextResponse.json(
      { user_detail: result.rows, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

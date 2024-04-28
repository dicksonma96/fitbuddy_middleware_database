import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import getTodayDate from "../../utils/getTodayDate";

export async function POST(req) {
  try {
    const request = await req.json();
    const result = await sql`INSERT INTO user_complete (
        tutorial_id,
        user_id,
        date
    ) VALUES (
    ${request.tutorial_id},
    ${request.user_id},
    ${getTodayDate()})`;

    return NextResponse.json(
      { data: result, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

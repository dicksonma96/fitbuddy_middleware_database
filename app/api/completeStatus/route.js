import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import getTodayDate from "../../utils/getTodayDate";

export async function GET(request) {
  const tutorial_id = request.nextUrl.searchParams.get("tutorial_id");
  const user_id = request.nextUrl.searchParams.get("user_id");

  try {
    const result =
      await sql`SELECT * FROM user_complete WHERE user_id = ${user_id} AND tutorial_id = ${tutorial_id} AND DATE = ${getTodayDate()}`;

    return NextResponse.json(
      { data: result.rows, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

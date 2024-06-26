import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request) {
  noStore();
  const user_id = request.nextUrl.searchParams.get("user_id");
  try {
    if (user_id == null)
      return NextResponse.json(
        { data: null, message: "Success" },
        { status: 200 }
      );

    const result =
      await sql`select user_complete.*, tutorial.name from user_complete LEFT JOIN tutorial ON user_complete.tutorial_id = tutorial.id where user_id = ${user_id}`;

    return NextResponse.json(
      { data: result.rows, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

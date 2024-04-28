import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request) {
  noStore();
  const tutorial_id = request.nextUrl.searchParams.get("tutorial_id");
  try {
    if (tutorial_id == null)
      return NextResponse.json(
        { data: null, message: "Success" },
        { status: 200 }
      );

    let res = null;
    const result = await sql`select * from tutorial where id = ${tutorial_id}`;

    if (result.rows.length) {
      const exercise =
        await sql`select * from exercise where tutorial_id = ${tutorial_id} ORDER BY id`;
      res = {
        ...result.rows[0],
        exercise: exercise.rows,
      };
    }

    return NextResponse.json(
      { data: res, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

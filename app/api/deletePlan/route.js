import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function DELETE(request) {
  noStore();
  const plan_id = request.nextUrl.searchParams.get("id");
  try {
    const result = await sql`DELETE FROM workout_plan where id = ${plan_id}`;

    return NextResponse.json(
      { data: result.rows, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

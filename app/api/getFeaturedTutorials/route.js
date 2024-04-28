import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  try {
    const result =
      await sql`select * from tutorial where featured = true ORDER BY id`;

    return NextResponse.json(
      { data: result.rows, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

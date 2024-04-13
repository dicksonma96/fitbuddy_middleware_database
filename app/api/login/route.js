import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const request = await req.json();
    const result =
      await sql`select * from users where username = ${request.username}`;

    if (result.rows.length <= 0) {
      throw "User doesn't exist";
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

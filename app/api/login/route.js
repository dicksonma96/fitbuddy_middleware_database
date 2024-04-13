import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const request = await req.json();
    const result =
      await sql`select * from users where username = ${request.username}`;

    if (result.rows.length <= 0) {
      throw "User doesn't exist";
    } else {
      if (result.rows[0].password != request.password) {
        throw "Incorrect password";
      }
    }
    delete result.rows[0].password;

    let resInfo = {
      ...result.rows[0],
    };

    return NextResponse.json(
      { userinfo: resInfo, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

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

    let user_detail = {};
    const detail =
      await sql`select * from user_details where user_id = ${result.rows[0].id} `;

    if (detail.rows.length) {
      user_detail = detail.rows[0];
    }

    let resInfo = {
      ...result.rows[0],
      detail: user_detail,
    };

    return NextResponse.json(
      { userinfo: resInfo, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

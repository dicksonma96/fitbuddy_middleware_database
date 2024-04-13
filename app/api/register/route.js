import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import CheckEmptyValues from "@/app/utils/CheckEmptyValues";
import { uuid } from "uuidv4";

export async function POST(req) {
  try {
    const request = await req.json();
    console.log(request);
    const isAllFilled = CheckEmptyValues(request);
    if (isAllFilled != "") throw isAllFilled;

    const userExist =
      await sql`select * from users where username = ${request.username}`;

    if (userExist.rows.length) {
      throw "User already exist";
    }

    const emailExist =
      await sql`select * from users where email = ${request.email}`;

    if (emailExist.rows.length) {
      throw "Email already been used";
    }
    let uid = uuid();
    const result =
      await sql`INSERT INTO users (id, username, email, password) VALUES (${uid}, ${request.username}, ${request.email}, ${request.password});`;

    return NextResponse.json(
      { result: result, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

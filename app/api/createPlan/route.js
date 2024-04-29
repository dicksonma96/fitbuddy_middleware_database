import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import CheckEmptyValues from "@/app/utils/CheckEmptyValues";

export async function POST(req) {
  try {
    const request = await req.json();
    const isAllFilled = CheckEmptyValues(request);
    if (isAllFilled != "") throw isAllFilled;
    const result = await sql`INSERT INTO workout_plan (
        user_id,
        tutorials,
        name
    ) VALUES (
    ${request.user_id},
    ${request.tutorials},
    ${request.name})`;

    return NextResponse.json(
      { result: result, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

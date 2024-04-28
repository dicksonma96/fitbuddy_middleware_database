import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import CheckEmptyValues from "@/app/utils/CheckEmptyValues";

export async function POST(req) {
  try {
    const request = await req.json();
    const isAllFilled = CheckEmptyValues(request);
    if (isAllFilled != "") throw isAllFilled;
    const result = await sql`INSERT INTO exercise (
        name,
        description,
        reps,
        duration,
        tutorial_id
    ) VALUES (
    ${request.name},
    ${request.description},
    ${request.reps},
    ${request.duration},
    ${request.tutorial_id}
)
    `;

    return NextResponse.json(
      { result: result, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

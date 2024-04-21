import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import CheckEmptyValues from "@/app/utils/CheckEmptyValues";
import { uuid } from "uuidv4";

export async function POST(req) {
  try {
    const request = await req.json();
    const isAllFilled = CheckEmptyValues(request);
    if (isAllFilled != "") throw isAllFilled;

    const result = await sql`INSERT INTO user_details 
    (user_id,
        gender,
        height,
        weight,
        target_weight,
        exercise_freq,
        plank_last,
        home_equip)
    VALUES (
      ${request.user_id},
      ${request.gender},
      ${request.height},
      ${request.weight},
      ${request.target_weight},
      ${request.exercise_freq},
      ${request.plank_last},
      ${request.home_equip}    
    )
    ON CONFLICT (user_id)
    DO UPDATE SET 
    gender= ${request.gender},
    height = ${request.height},
    weight = ${request.weight},
    target_weight = ${request.target_weight},
    exercise_freq = ${request.exercise_freq},
    plank_last = ${request.plank_last},
    home_equip = ${request.home_equip}
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

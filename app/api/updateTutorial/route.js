import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import CheckEmptyValues from "@/app/utils/CheckEmptyValues";

export async function POST(req) {
  try {
    const request = await req.json();
    const isAllFilled = CheckEmptyValues(request);
    if (isAllFilled != "") throw isAllFilled;
    const result = await sql`UPDATE tutorial SET 
    img_url= ${request.img_url},
    name= ${request.name},
    time = ${request.time},
    featured = ${request.featured},
    premium = ${request.premium},
    description = ${request.description}
    WHERE id = ${request.id}
    `;

    if (request.exercise && request.exercise.length) {
      let exerciseArr = request.exercise;
      let promiseArr = [];
      for (const exercise of exerciseArr) {
        promiseArr.push(sql`UPDATE exercise SET 
            name = ${exercise.name},
            description = ${exercise.description},
            reps = ${exercise.reps},
            duration = ${exercise.duration}
            WHERE id = ${exercise.id}
            `);
      }
      await Promise.all(promiseArr);
    }
    console.log(result);
    return NextResponse.json(
      { result: result, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request) {
  noStore();
  const user_id = request.nextUrl.searchParams.get("user_id");
  try {
    if (user_id == null)
      return NextResponse.json(
        { data: null, message: "Success" },
        { status: 200 }
      );

    const result =
      await sql`SELECT wp.id as workout_plan_id, wp.name as plan_name,
      unnested.t_id, 
      tutorial.name, 
      tutorial.img_url
FROM workout_plan wp
LEFT JOIN (
   SELECT id, unnest(tutorials) as t_id
   FROM workout_plan 
   WHERE user_id = ${user_id}
) AS unnested ON wp.id = unnested.id
LEFT JOIN LATERAL (
   SELECT id, name, img_url
   FROM tutorial 
   WHERE tutorial.id = unnested.t_id
) AS tutorial ON true`;

    let groupedData = result.rows;
    if (result.rows.length) {
      groupedData = result.rows.reduce((acc, curr) => {
        const { workout_plan_id, t_id, name, img_url, plan_name } = curr;

        if (!acc[workout_plan_id]) {
          acc[workout_plan_id] = {
            workout_plan_id,
            plan_name,
            tutorials: [],
          };
        }

        acc[workout_plan_id].tutorials.push({ t_id, name, img_url });

        return acc;
      }, {});

      groupedData = Object.values(groupedData);
    }
    // console.log(groupedData);
    return NextResponse.json(
      { data: groupedData, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

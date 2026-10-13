import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 30;

const PlanSchema = z.object({
  tasks: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .min(3)
    .max(8),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        weeksFromStart: z.number().int().min(1).max(40),
      }),
    )
    .min(2)
    .max(5),
});

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 200 ||
      String(description ?? "").length > 2000
    ) {
      return Response.json({ error: "Invalid project title or description." }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google("gemini-3.1-flash-lite"),
      schema: PlanSchema,
      system:
        "You plan final-year university software projects. Return realistic, concrete tasks and milestones a small student team can finish in one academic year. Order milestones by time.",
      prompt: `Project title: ${title}\nDescription: ${description ?? ""}`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Plan API error:", error);
    return Response.json(
      { error: "The AI planner is unavailable. You can add tasks and milestones manually." },
      { status: 502 },
    );
  }
}
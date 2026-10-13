import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

const STUDENT_PROMPT =
  "You are a helpful AI Project Assistant for an FYP Management Platform. Help students with project planning, milestones, tasks, documentation, meetings, and supervisor feedback. Give clear and practical answers.";

const SUPERVISOR_PROMPT =
  "You are a helpful AI Assistant for supervisors on an FYP Management Platform. Help supervisors write constructive feedback, review project proposals, evaluate team progress fairly, and plan supervision meetings. Address the user as a supervisor, not as a student. Give clear and practical answers.";
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 15; // 15 requests per minute
}
export async function POST(req: Request) {
  try {
    const {
      messages,
      role,
      
    }: { messages: UIMessage[]; role?: "student" | "supervisor" } =
      await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Please enter a question before sending.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
if (isRateLimited(ip)) {
  return new Response(JSON.stringify({ error: "Too many requests. Please wait a minute." }), {
    status: 429,
    headers: { "Content-Type": "application/json" },
  });
}

const lastText = messages
  .at(-1)
  ?.parts.map((p) => (p.type === "text" ? p.text : ""))
  .join("") ?? "";
if (lastText.length > 2000) {
  return new Response(JSON.stringify({ error: "Message is too long (max 2000 characters)." }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
    const result = streamText({
      model: google("gemini-3.1-flash-lite"),

      system: role === "supervisor" ? SUPERVISOR_PROMPT : STUDENT_PROMPT,

      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API Chat Route Error:", error);

    return new Response(
      JSON.stringify({
        error:
          "The AI Assistant is temporarily unavailable. Please try again in a moment.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
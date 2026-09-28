import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    console.log("Received messages:", messages);

    const result = streamText({
      model: google("gemini-3.1-flash-lite"),

      system:
        "You are a helpful AI Project Assistant for an FYP Management Platform. Help students with project planning, milestones, tasks, documentation, meetings, and supervisor feedback. Give clear and practical answers.",

      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API Chat Route Error:", error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
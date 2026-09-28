"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const text = input.trim();

    setInput("");

    await sendMessage({
      text,
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:p-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          AI Project Assistant
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Ask questions about your FYP, milestones, tasks, documentation, and
          project planning.
        </p>
      </div>

      <div className="min-h-[300px] space-y-4 overflow-y-auto rounded-lg border bg-slate-50 p-3 sm:min-h-[400px] sm:p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Ask your first question about your FYP.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-800 shadow-sm"
              }`}
            >
              <p className="mb-1 text-xs font-semibold opacity-70">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>

              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <p className="text-sm text-slate-500">Thinking...</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 sm:flex-row"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your FYP..."
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="w-full rounded-lg bg-red-600 px-5 py-3 font-medium text-white sm:w-auto"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50 sm:w-auto"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}


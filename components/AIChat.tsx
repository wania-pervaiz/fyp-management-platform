"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

export type ChatRole = "student" | "supervisor";

const ROLE_CONTENT: Record<
  ChatRole,
  {
    heading: string;
    intro: string;
    placeholder: string;
    prompts: string[];
  }
> = {
  student: {
    heading: "How can I help with your FYP?",
    intro: "Ask a question or choose one of the examples below to get started.",
    placeholder: "Ask about your FYP...",
    prompts: [
      "I have 6 weeks left. What should I prioritize?",
      "Break my FYP into weekly milestones.",
      "How should I prepare for project testing?",
      "Help me understand my supervisor's feedback.",
    ],
  },
  supervisor: {
    heading: "How can I help you supervise your projects?",
    intro: "Ask a question or choose one of the examples below to get started.",
    placeholder: "Ask about supervising your teams...",
    prompts: [
      "Help me write constructive feedback for a student team.",
      "What should I check in a final-year project proposal?",
      "How do I evaluate team progress fairly?",
      "Suggest questions for a progress meeting.",
    ],
  },
};

export default function AIChat({ role = "student" }: { role?: ChatRole }) {
  const content = ROLE_CONTENT[role];
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // The role is sent to /api/chat with every message
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { role } }),
    [role],
  );

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({ transport });
  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    setInput("");
    await sendMessage({ text });
  }

  function pickPrompt(prompt: string) {
    if (isLoading) return;
    setInput(prompt);
  }

  return (
    <div className="flex flex-col">
      {/* Chat area */}
      <div
        className="h-[460px] space-y-4 overflow-y-auto rounded-2xl border border-[#176B73]/30 bg-[#123342] p-4 sm:h-[520px] sm:p-6"
        aria-live="polite"
        aria-label="AI conversation"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#176B73] text-2xl font-black text-[#7FD6CC] shadow-inner"
              aria-hidden="true"
            >
              AI
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {content.heading}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              {content.intro}
            </p>

            <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
              {content.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => pickPrompt(prompt)}
                  disabled={isLoading}
                  className="rounded-2xl border border-[#176B73]/30 bg-[#0C2430] p-4 text-left text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#7FD6CC]/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%] ${
                      isUser
                        ? "bg-[#176B73] text-white"
                        : "border border-[#176B73]/30 bg-[#0C2430] text-slate-100"
                    }`}
                  >
                    <p
                      className={`mb-1 text-xs font-semibold ${
                        isUser ? "text-[#7FD6CC]" : "text-[#7FD6CC]"
                      }`}
                    >
                      {isUser ? "You" : "AI Assistant"}
                    </p>

                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <p
                            key={index}
                            className="whitespace-pre-wrap text-sm leading-6"
                          >
                            {part.text}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#176B73]/30 bg-[#0C2430] px-4 py-3 text-sm text-slate-300">
                  AI Assistant is thinking...
                </div>
              </div>
            )}
          </>
        )}
         {error && (
          <div role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
            The AI Assistant is unavailable right now.{" "}
            <button type="button" onClick={() => regenerate()} className="font-bold underline">
              Try again
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-full flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="ai-question" className="sr-only">
          Ask the AI Assistant
        </label>

        <input
          id="ai-question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={content.placeholder}
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-xl border border-[#176B73]/30 bg-[#0C2430] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#7FD6CC] disabled:opacity-60"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="w-full rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 sm:w-auto"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full rounded-xl bg-[#176B73] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f8791] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
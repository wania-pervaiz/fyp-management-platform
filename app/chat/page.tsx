'use client';

import { useState } from 'react';
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.text();
      
      if (!response.ok) {
        throw new Error(data || 'Failed to fetch response');
      }

      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `Error: ${error.message || 'Something went wrong.'}` 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between">
      <h1 className="text-xl font-bold mb-4 text-black">FYP AI Assistant</h1>

      {/* Message History Box */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 border rounded-lg p-4 bg-gray-50 mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white text-gray-800 border shadow-sm'
              }`}
            >
              <p className="font-semibold text-xs opacity-75 mb-1">{m.role === 'user' ? 'You' : 'AI'}</p>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm animate-pulse">AI is thinking...</div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your FYP project..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}
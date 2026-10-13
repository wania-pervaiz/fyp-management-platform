"use client";

import AIChat from "@/components/AIChat";
import SupervisorShell, { useSupervisor } from "@/components/SupervisorShell";
import { cardClass } from "@/components/StudentShell";

export default function SupervisorAIAssistantPage() {
  const { user } = useSupervisor();

  if (!user) return null;

  return (
    <SupervisorShell
      user={user}
      activeHref="/supervisor/ai-assistant"
      section="AI ASSISTANT"
      title="AI Assistant"
      subtitle="Get help writing feedback, reviewing project plans and guiding your teams."
    >
      <section className={`${cardClass} overflow-hidden !p-4 sm:!p-6`}>
        <AIChat  role="supervisor" />
      </section>
    </SupervisorShell>
  );
}
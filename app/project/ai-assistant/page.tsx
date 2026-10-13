"use client";

import AIChat from "@/components/AIChat";
import StudentShell, {
  cardClass,
  useActiveProject,
} from "@/components/StudentShell";

export default function StudentAIAssistantPage() {
  const project = useActiveProject();

  if (!project) return null;

  return (
    <StudentShell
      project={project}
      activeHref="/project/ai-assistant"
      section="AI ASSISTANT"
      title="AI Assistant"
      subtitle="Get help with ideas, task planning, documentation and your final-year project:"
    >
      <section className={`${cardClass} overflow-hidden !p-4 sm:!p-6`}>
        <AIChat role="student" />
      </section>
    </StudentShell>
  );
}
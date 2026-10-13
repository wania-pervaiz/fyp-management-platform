"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/project-storage";

export default function AIAssistantRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      getCurrentUser()?.role === "supervisor"
        ? "/supervisor/ai-assistant"
        : "/project/ai-assistant",
    );
  }, [router]);

  return null;
}
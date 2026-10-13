import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FYP Management Platform",
  description:
    "Manage your final-year project: teams, tasks, milestones, and supervisor feedback in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
import type { Project } from "@/lib/project-storage";

export const BUILT_IN_PROJECTS: Project[] = [
  {
    id: "demo-smart-attendance",
    title: "Smart Attendance System",
    description:
      "A system for recording student attendance, tracking records, and generating attendance reports.",
    joiningCode: "ATTEND2026",
    status: "In Progress",
    createdBy: "demo",
    createdAt: "2026-10-01T00:00:00.000Z",
    startDate: "2026-10-01",
    expectedCompletionDate: "2027-03-31",
    supervisorName: "Dr. Ahmed",
    supervisorEmail: "ahmed@example.com",
    supervisors: [
      {
        id: "demo-supervisor-attendance",
        name: "Dr. Ahmed",
        email: "ahmed@example.com",
      },
    ],
    teamMembers: ["ali@example.com", "sara@example.com"],
    members: [
      {
        id: "demo-member-attendance-1",
        name: "Ali Ahmed",
        email: "ali@example.com",
        role: "Leader",
      },
      {
        id: "demo-member-attendance-2",
        name: "Sara Khan",
        email: "sara@example.com",
        role: "Member",
      },
    ],
  },
  {
    id: "demo-campus-library",
    title: "Campus Library Management",
    description:
      "A system for managing library books, student borrowing, returns, and book availability.",
    joiningCode: "LIBRARY2026",
    status: "In Progress",
    createdBy: "demo",
    createdAt: "2026-10-01T00:00:00.000Z",
    startDate: "2026-10-01",
    expectedCompletionDate: "2027-03-31",
    supervisorName: "Dr. Fatima",
    supervisorEmail: "fatima@example.com",
    supervisors: [
      {
        id: "demo-supervisor-library",
        name: "Dr. Fatima",
        email: "fatima@example.com",
      },
    ],
    teamMembers: ["usman@example.com", "ayesha@example.com"],
    members: [
      {
        id: "demo-member-library-1",
        name: "Usman Ali",
        email: "usman@example.com",
        role: "Leader",
      },
      {
        id: "demo-member-library-2",
        name: "Ayesha Noor",
        email: "ayesha@example.com",
        role: "Member",
      },
    ],
  },
  {
    id: "demo-expense-tracker",
    title: "Expense Tracker",
    description:
      "An application for recording expenses, organizing spending, and reviewing budget summaries.",
    joiningCode: "EXPENSE2026",
    status: "Planning",
    createdBy: "demo",
    createdAt: "2026-10-01T00:00:00.000Z",
    startDate: "2026-10-01",
    expectedCompletionDate: "2027-03-31",
    supervisorName: "Mr. Bilal",
    supervisorEmail: "bilal@example.com",
    supervisors: [
      {
        id: "demo-supervisor-expense",
        name: "Mr. Bilal",
        email: "bilal@example.com",
      },
    ],
    teamMembers: ["hamza@example.com", "noor@example.com"],
    members: [
      {
        id: "demo-member-expense-1",
        name: "Hamza Khan",
        email: "hamza@example.com",
        role: "Leader",
      },
      {
        id: "demo-member-expense-2",
        name: "Noor Fatima",
        email: "noor@example.com",
        role: "Member",
      },
    ],
  },
];
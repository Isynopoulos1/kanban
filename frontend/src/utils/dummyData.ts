import { Column } from "../types/kanban";

export const initialColumns: Column[] = [
  {
    id: "col-backlog",
    title: "Backlog",
    cards: [
      {
        id: "card-1",
        title: "Research target audience",
        details: "Conduct user interviews and surveys to identify core user personas and pain points.",
      },
      {
        id: "card-2",
        title: "Define brand guidelines",
        details: "Draft logo variants, typography styles, and core color palette matching the marketing vision.",
      },
    ],
  },
  {
    id: "col-todo",
    title: "To Do",
    cards: [
      {
        id: "card-3",
        title: "Create Figma landing page wireframes",
        details: "Design low-fidelity desktop and mobile layouts for user feedback.",
      },
      {
        id: "card-4",
        title: "Set up project repository",
        details: "Configure workspace, ESLint rules, Prettier formatting, and CI/CD pipelines.",
      },
    ],
  },
  {
    id: "col-inprogress",
    title: "In Progress",
    cards: [
      {
        id: "card-5",
        title: "Implement database schema design",
        details: "Model user profiles, workspace entities, and permissions inside PostgreSQL.",
      },
    ],
  },
  {
    id: "col-review",
    title: "Review",
    cards: [
      {
        id: "card-6",
        title: "Draft security compliance policy",
        details: "Document privacy protocols, GDPR controls, and local hosting configurations.",
      },
    ],
  },
  {
    id: "col-done",
    title: "Done",
    cards: [
      {
        id: "card-7",
        title: "Kickoff stakeholder meeting",
        details: "Align product specifications, timelines, and resourcing for the upcoming sprint.",
      },
    ],
  },
];

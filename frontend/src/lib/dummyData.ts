import type { BoardState } from "./types";

export const initialBoardState: BoardState = {
  columns: [
    { id: "col-backlog", title: "Backlog" },
    { id: "col-todo", title: "To Do" },
    { id: "col-in-progress", title: "In Progress" },
    { id: "col-review", title: "Review" },
    { id: "col-done", title: "Done" },
  ],
  cards: [
    {
      id: "card-1",
      title: "Design board layout",
      details: "Sketch wireframes for the five-column kanban board.",
      columnId: "col-backlog",
    },
    {
      id: "card-2",
      title: "Set up project repo",
      details: "Initialize Next.js app with TypeScript and Tailwind.",
      columnId: "col-backlog",
    },
    {
      id: "card-3",
      title: "Implement drag and drop",
      details: "Use dnd-kit for card movement between columns.",
      columnId: "col-todo",
    },
    {
      id: "card-4",
      title: "Add card form",
      details: "Allow users to create cards with title and details.",
      columnId: "col-todo",
    },
    {
      id: "card-5",
      title: "Build column rename",
      details: "Inline editing for column titles.",
      columnId: "col-in-progress",
    },
    {
      id: "card-6",
      title: "Style with brand colors",
      details: "Apply accent yellow, blue, purple, navy, and gray palette.",
      columnId: "col-in-progress",
    },
    {
      id: "card-7",
      title: "Write unit tests",
      details: "Cover board reducer and core components with Vitest.",
      columnId: "col-review",
    },
    {
      id: "card-8",
      title: "Add Playwright e2e tests",
      details: "Verify add, delete, rename, and drag flows end to end.",
      columnId: "col-review",
    },
    {
      id: "card-9",
      title: "Ship MVP",
      details: "Final polish and handoff with dev server running.",
      columnId: "col-done",
    },
  ],
};

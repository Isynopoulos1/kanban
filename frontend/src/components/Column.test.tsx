import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Column } from "./Column";
import type { Card as CardType, Column as ColumnType } from "@/lib/types";

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  verticalListSortingStrategy: {},
}));

vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}));

vi.mock("./Card", () => ({
  Card: ({ card }: { card: CardType }) => (
    <div data-testid={`card-${card.id}`}>{card.title}</div>
  ),
}));

const column: ColumnType = { id: "col-1", title: "To Do" };
const cards: CardType[] = [
  { id: "c1", title: "First", details: "", columnId: "col-1" },
  { id: "c2", title: "Second", details: "", columnId: "col-1" },
];

describe("Column", () => {
  it("renders column title and cards", () => {
    render(
      <Column
        column={column}
        cards={cards}
        onRename={() => {}}
        onAddCard={() => {}}
        onDeleteCard={() => {}}
      />,
    );
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("allows renaming via inline edit", async () => {
    const onRename = vi.fn();
    const user = userEvent.setup();
    render(
      <Column
        column={column}
        cards={cards}
        onRename={onRename}
        onAddCard={() => {}}
        onDeleteCard={() => {}}
      />,
    );
    await user.click(screen.getByTestId("column-title-col-1"));
    const input = screen.getByLabelText("Column title");
    await user.clear(input);
    await user.type(input, "In Progress{Enter}");
    expect(onRename).toHaveBeenCalledWith("col-1", "In Progress");
  });
});

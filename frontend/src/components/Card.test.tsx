import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./Card";
import type { Card as CardType } from "@/lib/types";

const card: CardType = {
  id: "test-card",
  title: "Test Title",
  details: "Test details here",
  columnId: "col-1",
};

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

describe("Card", () => {
  it("renders title and details", () => {
    render(<Card card={card} onDelete={() => {}} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test details here")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<Card card={card} onDelete={onDelete} />);
    await user.click(screen.getByLabelText("Delete Test Title"));
    expect(onDelete).toHaveBeenCalledWith("test-card");
  });
});

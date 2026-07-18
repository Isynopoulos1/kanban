import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import KanbanBoard from "../components/KanbanBoard";
import { useKanban } from "../hooks/useKanban";
import { renderHook } from "@testing-library/react";

describe("useKanban Hook", () => {
  it("should initialize with 5 columns", () => {
    const { result } = renderHook(() => useKanban());
    expect(result.current.columns).toHaveLength(5);
    expect(result.current.columns[0].title).toBe("Backlog");
  });

  it("should rename a column", () => {
    const { result } = renderHook(() => useKanban());
    act(() => {
      result.current.renameColumn(result.current.columns[0].id, "New Backlog Name");
    });
    expect(result.current.columns[0].title).toBe("New Backlog Name");
  });

  it("should add a card to a column", () => {
    const { result } = renderHook(() => useKanban());
    const initialCount = result.current.columns[0].cards.length;
    act(() => {
      result.current.addCard(result.current.columns[0].id, "Test Title", "Test Details");
    });
    expect(result.current.columns[0].cards).toHaveLength(initialCount + 1);
    expect(result.current.columns[0].cards[initialCount].title).toBe("Test Title");
    expect(result.current.columns[0].cards[initialCount].details).toBe("Test Details");
  });

  it("should delete a card", () => {
    const { result } = renderHook(() => useKanban());
    const firstCol = result.current.columns[0];
    const targetCardId = firstCol.cards[0].id;
    const initialCount = firstCol.cards.length;

    act(() => {
      result.current.deleteCard(targetCardId);
    });

    expect(result.current.columns[0].cards).toHaveLength(initialCount - 1);
    expect(result.current.columns[0].cards.find((c) => c.id === targetCardId)).toBeUndefined();
  });

  it("should reorder cards in the same column", () => {
    const { result } = renderHook(() => useKanban());
    const colId = result.current.columns[0].id;
    const initialCards = [...result.current.columns[0].cards];
    expect(initialCards.length).toBeGreaterThanOrEqual(2);

    act(() => {
      result.current.moveCard(colId, colId, 0, 1);
    });

    expect(result.current.columns[0].cards[0].id).toBe(initialCards[1].id);
    expect(result.current.columns[0].cards[1].id).toBe(initialCards[0].id);
  });

  it("should move cards between different columns", () => {
    const { result } = renderHook(() => useKanban());
    const colId1 = result.current.columns[0].id;
    const colId2 = result.current.columns[1].id;
    const cardToMove = result.current.columns[0].cards[0];
    const initialCol1Count = result.current.columns[0].cards.length;
    const initialCol2Count = result.current.columns[1].cards.length;

    act(() => {
      result.current.moveCard(colId1, colId2, 0, 0);
    });

    expect(result.current.columns[0].cards).toHaveLength(initialCol1Count - 1);
    expect(result.current.columns[1].cards).toHaveLength(initialCol2Count + 1);
    expect(result.current.columns[1].cards[0].id).toBe(cardToMove.id);
  });
});

describe("KanbanBoard UI Component", () => {
  it("renders the kanban board with all columns and header", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Kanban")).toBeInTheDocument();
    expect(screen.getByText("Board")).toBeInTheDocument();
    expect(screen.getByTestId("kanban-board")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Backlog")).toBeInTheDocument();
    expect(screen.getByDisplayValue("To Do")).toBeInTheDocument();
  });

  it("allows renaming a column", () => {
    render(<KanbanBoard />);
    const backlogInput = screen.getByTestId("column-title-input-col-backlog") as HTMLInputElement;
    fireEvent.change(backlogInput, { target: { value: "Refactored Backlog" } });
    fireEvent.blur(backlogInput);
    expect(backlogInput.value).toBe("Refactored Backlog");
  });

  it("opens the modal and adds a new card", () => {
    render(<KanbanBoard />);
    const addCardBtn = screen.getByTestId("add-card-btn-col-backlog");
    fireEvent.click(addCardBtn);

    // Modal is open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const titleInput = screen.getByLabelText("Title");
    const detailsInput = screen.getByLabelText("Details");
    const submitBtn = screen.getByText("Create Card");

    fireEvent.change(titleInput, { target: { value: "New Task Title" } });
    fireEvent.change(detailsInput, { target: { value: "Task details description text" } });
    fireEvent.click(submitBtn);

    // Modal should close and card should be rendered
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("New Task Title")).toBeInTheDocument();
    expect(screen.getByText("Task details description text")).toBeInTheDocument();
  });
});

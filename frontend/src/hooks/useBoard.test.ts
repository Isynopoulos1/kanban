import { describe, it, expect, vi, beforeEach } from "vitest";
import { boardReducer } from "@/hooks/useBoard";
import { initialBoardState } from "@/lib/dummyData";
import type { BoardState } from "@/lib/types";

const baseState: BoardState = {
  columns: [
    { id: "col-1", title: "A" },
    { id: "col-2", title: "B" },
  ],
  cards: [
    { id: "c1", title: "Card 1", details: "D1", columnId: "col-1" },
    { id: "c2", title: "Card 2", details: "D2", columnId: "col-1" },
    { id: "c3", title: "Card 3", details: "D3", columnId: "col-2" },
  ],
};

describe("boardReducer", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "new-uuid",
    });
  });

  it("renames a column", () => {
    const result = boardReducer(baseState, {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "Renamed",
    });
    expect(result.columns.find((c) => c.id === "col-1")?.title).toBe("Renamed");
  });

  it("adds a card to a column", () => {
    const result = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-2",
      title: "New",
      details: "Details",
    });
    const col2Cards = result.cards.filter((c) => c.columnId === "col-2");
    expect(col2Cards).toHaveLength(2);
    expect(col2Cards[1]).toMatchObject({
      id: "card-new-uuid",
      title: "New",
      details: "Details",
      columnId: "col-2",
    });
  });

  it("deletes a card", () => {
    const result = boardReducer(baseState, {
      type: "DELETE_CARD",
      cardId: "c1",
    });
    expect(result.cards).toHaveLength(2);
    expect(result.cards.find((c) => c.id === "c1")).toBeUndefined();
  });

  it("noops when deleting nonexistent card", () => {
    const result = boardReducer(baseState, {
      type: "DELETE_CARD",
      cardId: "missing",
    });
    expect(result.cards).toHaveLength(3);
  });

  it("moves a card to another column", () => {
    const result = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "c1",
      targetColumnId: "col-2",
      targetIndex: 0,
    });
    const col2Cards = result.cards.filter((c) => c.columnId === "col-2");
    expect(col2Cards[0].id).toBe("c1");
    expect(result.cards.filter((c) => c.columnId === "col-1")).toHaveLength(1);
  });

  it("reorders within the same column", () => {
    const result = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "c1",
      targetColumnId: "col-1",
      targetIndex: 1,
    });
    const col1Cards = result.cards.filter((c) => c.columnId === "col-1");
    expect(col1Cards.map((c) => c.id)).toEqual(["c2", "c1"]);
  });

  it("noops when moving nonexistent card", () => {
    const result = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "missing",
      targetColumnId: "col-2",
      targetIndex: 0,
    });
    expect(result).toEqual(baseState);
  });

  it("initial board state has 5 columns and cards", () => {
    expect(initialBoardState.columns).toHaveLength(5);
    expect(initialBoardState.cards.length).toBeGreaterThan(0);
  });
});

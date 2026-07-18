import { useReducer, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { BoardState } from "@/lib/types";

export type BoardAction =
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "ADD_CARD"; columnId: string; title: string; details: string }
  | { type: "DELETE_CARD"; cardId: string }
  | {
      type: "MOVE_CARD";
      cardId: string;
      targetColumnId: string;
      targetIndex: number;
    };

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "RENAME_COLUMN":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.columnId ? { ...col, title: action.title } : col,
        ),
      };

    case "ADD_CARD": {
      const newCard = {
        id: `card-${crypto.randomUUID()}`,
        title: action.title,
        details: action.details,
        columnId: action.columnId,
      };
      const columnCards = state.cards.filter(
        (c) => c.columnId === action.columnId,
      );
      const otherCards = state.cards.filter(
        (c) => c.columnId !== action.columnId,
      );
      return {
        ...state,
        cards: [...otherCards, ...columnCards, newCard],
      };
    }

    case "DELETE_CARD":
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.cardId),
      };

    case "MOVE_CARD": {
      const card = state.cards.find((c) => c.id === action.cardId);
      if (!card) return state;

      if (card.columnId === action.targetColumnId) {
        const columnCards = state.cards.filter(
          (c) => c.columnId === action.targetColumnId,
        );
        const oldIndex = columnCards.findIndex((c) => c.id === action.cardId);
        const newIndex = Math.max(
          0,
          Math.min(action.targetIndex, columnCards.length - 1),
        );
        if (oldIndex === -1 || oldIndex === newIndex) return state;

        const reordered = arrayMove(columnCards, oldIndex, newIndex);
        const result: typeof state.cards = [];
        for (const col of state.columns) {
          if (col.id === action.targetColumnId) {
            result.push(...reordered);
          } else {
            result.push(...state.cards.filter((c) => c.columnId === col.id));
          }
        }
        return { ...state, cards: result };
      }

      const remaining = state.cards.filter((c) => c.id !== action.cardId);
      const targetColumnCards = remaining.filter(
        (c) => c.columnId === action.targetColumnId,
      );
      const otherCards = remaining.filter(
        (c) => c.columnId !== action.targetColumnId,
      );

      const movedCard = { ...card, columnId: action.targetColumnId };
      const clampedIndex = Math.max(
        0,
        Math.min(action.targetIndex, targetColumnCards.length),
      );
      targetColumnCards.splice(clampedIndex, 0, movedCard);

      const result: typeof state.cards = [];
      for (const col of state.columns) {
        if (col.id === action.targetColumnId) {
          result.push(...targetColumnCards);
        } else {
          result.push(...otherCards.filter((c) => c.columnId === col.id));
        }
      }

      return { ...state, cards: result };
    }

    default:
      return state;
  }
}

export function useBoard(initialState: BoardState) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const renameColumn = useCallback((columnId: string, title: string) => {
    dispatch({ type: "RENAME_COLUMN", columnId, title });
  }, []);

  const addCard = useCallback(
    (columnId: string, title: string, details: string) => {
      dispatch({ type: "ADD_CARD", columnId, title, details });
    },
    [],
  );

  const deleteCard = useCallback((cardId: string) => {
    dispatch({ type: "DELETE_CARD", cardId });
  }, []);

  const moveCard = useCallback(
    (cardId: string, targetColumnId: string, targetIndex: number) => {
      dispatch({ type: "MOVE_CARD", cardId, targetColumnId, targetIndex });
    },
    [],
  );

  const getColumnCards = useCallback(
    (columnId: string) => state.cards.filter((c) => c.columnId === columnId),
    [state.cards],
  );

  return {
    state,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
    getColumnCards,
  };
}

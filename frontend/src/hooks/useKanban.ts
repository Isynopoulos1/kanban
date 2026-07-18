import { useState } from "react";
import { Column, Card } from "../types/kanban";
import { initialColumns } from "../utils/dummyData";

export function useKanban() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const renameColumn = (columnId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, title: newTitle.trim() } : col))
    );
  };

  const addCard = (columnId: string, title: string, details: string) => {
    if (!title.trim()) return;
    const newCard: Card = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: title.trim(),
      details: details.trim(),
    };
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: [...col.cards, newCard] };
        }
        return col;
      })
    );
  };

  const deleteCard = (cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  const moveCard = (
    sourceColId: string,
    targetColId: string,
    sourceIndex: number,
    targetIndex: number
  ) => {
    setColumns((prev) => {
      const sourceCol = prev.find((col) => col.id === sourceColId);
      const targetCol = prev.find((col) => col.id === targetColId);

      if (!sourceCol || !targetCol) return prev;

      // Handle movement inside the same column
      if (sourceColId === targetColId) {
        const newCards = [...sourceCol.cards];
        const [movedCard] = newCards.splice(sourceIndex, 1);
        if (!movedCard) return prev;
        newCards.splice(targetIndex, 0, movedCard);

        return prev.map((col) =>
          col.id === sourceColId ? { ...col, cards: newCards } : col
        );
      }

      // Handle movement between different columns
      const sourceCards = [...sourceCol.cards];
      const targetCards = [...targetCol.cards];
      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      if (!movedCard) return prev;
      targetCards.splice(targetIndex, 0, movedCard);

      return prev.map((col) => {
        if (col.id === sourceColId) {
          return { ...col, cards: sourceCards };
        }
        if (col.id === targetColId) {
          return { ...col, cards: targetCards };
        }
        return col;
      });
    });
  };

  return {
    columns,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}

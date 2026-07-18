"use client";

import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Card as CardType, Column as ColumnType } from "@/lib/types";
import { Card } from "./Card";
import { AddCardForm } from "./AddCardForm";

type ColumnProps = {
  column: ColumnType;
  cards: CardType[];
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function Column({
  column,
  cards,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function saveTitle() {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRename(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  }

  return (
    <div
      data-column-id={column.id}
      className={`column-shell flex w-72 shrink-0 flex-col rounded-[10px] transition-colors duration-200 ${
        isOver ? "is-over" : ""
      }`}
      data-testid={`column-${column.id}`}
    >
      <div className="px-3 pt-3 pb-2">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setEditTitle(column.title);
                setIsEditing(false);
              }
            }}
            autoFocus
            aria-label="Column title"
            className="form-input w-full rounded-lg px-3 py-1.5 text-sm font-medium"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditTitle(column.title);
              setIsEditing(true);
            }}
            className="column-pill inline-flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-left text-sm font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            data-testid={`column-title-${column.id}`}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--col-accent-text))]" />
            <span className="min-w-0 flex-1 truncate">{column.title}</span>
            <span className="shrink-0 text-xs opacity-70">{cards.length}</span>
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col px-3 pb-3"
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex min-h-[4rem] flex-col gap-2.5">
            {cards.map((card) => (
              <Card key={card.id} card={card} onDelete={onDeleteCard} />
            ))}
          </div>
        </SortableContext>

        <AddCardForm
          onAdd={(title, details) => onAddCard(column.id, title, details)}
        />
      </div>
    </div>
  );
}

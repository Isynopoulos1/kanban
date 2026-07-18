import React from "react";
import { Card } from "../types/kanban";

interface KanbanCardProps {
  card: Card;
  index: number;
  colId: string;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, colId: string, index: number) => void;
  onDragEnd: () => void;
  onDragOverCard: (e: React.DragEvent, index: number) => void;
  isDragging: boolean;
}

export default function KanbanCard({
  card,
  index,
  colId,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  isDragging,
}: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, colId, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOverCard(e, index);
  };

  return (
    <div
      className={`card ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      data-testid={`kanban-card-${card.id}`}
      id={`card-${card.id}`}
    >
      <button
        type="button"
        className="card-delete-btn"
        onClick={() => onDelete(card.id)}
        title="Delete card"
        aria-label="Delete card"
        data-testid={`delete-card-${card.id}`}
      >
        &times;
      </button>
      <div className="card-title" data-testid="card-title">
        {card.title}
      </div>
      {card.details && (
        <div className="card-details" data-testid="card-details">
          {card.details}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Column } from "../types/kanban";
import KanbanCard from "./KanbanCard";
import CardModal from "./CardModal";

interface KanbanColumnProps {
  column: Column;
  onRename: (columnId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDragStartCard: (e: React.DragEvent, colId: string, index: number) => void;
  onDragEndCard: () => void;
  onDragOverCardInColumn: (e: React.DragEvent, colId: string, index: number) => void;
  activeDrag: { colId: string; index: number } | null;
  onDropOnColumn: (e: React.DragEvent, colId: string) => void;
}

export default function KanbanColumn({
  column,
  onRename,
  onDeleteCard,
  onAddCard,
  onDragStartCard,
  onDragEndCard,
  onDragOverCardInColumn,
  activeDrag,
  onDropOnColumn,
}: KanbanColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOverColumn, setIsDragOverColumn] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const handleTitleBlur = () => {
    if (titleInput.trim() !== column.title) {
      onRename(column.id, titleInput);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (activeDrag && activeDrag.colId !== column.id) {
      setIsDragOverColumn(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOverColumn(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverColumn(false);
    onDropOnColumn(e, column.id);
  };

  return (
    <div
      className={`column ${isDragOverColumn ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`kanban-column-${column.id}`}
      id={`column-${column.id}`}
    >
      <div className="column-header">
        <div className="column-title-container">
          <input
            type="text"
            className="column-title-input"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            aria-label={`Rename column ${column.title}`}
            data-testid={`column-title-input-${column.id}`}
          />
        </div>
        <span className="card-count" data-testid="card-count">
          {column.cards.length}
        </span>
      </div>

      <div className="column-cards" data-testid={`column-cards-${column.id}`}>
        {column.cards.map((card, index) => {
          const isCardDragging =
            activeDrag !== null &&
            activeDrag.colId === column.id &&
            activeDrag.index === index;

          return (
            <KanbanCard
              key={card.id}
              card={card}
              index={index}
              colId={column.id}
              onDelete={onDeleteCard}
              onDragStart={onDragStartCard}
              onDragEnd={onDragEndCard}
              onDragOverCard={(e) => onDragOverCardInColumn(e, column.id, index)}
              isDragging={isCardDragging}
            />
          );
        })}
      </div>

      <button
        type="button"
        className="add-card-trigger-btn"
        onClick={() => setIsModalOpen(true)}
        data-testid={`add-card-btn-${column.id}`}
      >
        <span>+</span> Add Card
      </button>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(title, details) => onAddCard(column.id, title, details)}
        columnTitle={column.title}
      />
    </div>
  );
}

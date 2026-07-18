"use client";

import React, { useState, useRef } from "react";
import { useKanban } from "../hooks/useKanban";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard() {
  const { columns, renameColumn, addCard, deleteCard, moveCard } = useKanban();
  const [activeDrag, setActiveDrag] = useState<{ colId: string; index: number } | null>(null);
  
  // Track where the card is hovered synchronously during dragging
  const hoverInfo = useRef<{ colId: string; index: number | null } | null>(null);

  const handleDragStartCard = (e: React.DragEvent, colId: string, index: number) => {
    setActiveDrag({ colId, index });
    hoverInfo.current = { colId, index };
    // Set a light image transparency effect or standard ghost
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEndCard = () => {
    setActiveDrag(null);
    hoverInfo.current = null;
  };

  const handleDragOverCardInColumn = (e: React.DragEvent, colId: string, index: number) => {
    hoverInfo.current = { colId, index };
  };

  const handleDropOnColumn = (e: React.DragEvent, colId: string) => {
    if (!activeDrag) return;

    const column = columns.find((c) => c.id === colId);
    if (!column) return;

    let targetIndex = column.cards.length;

    if (
      hoverInfo.current &&
      hoverInfo.current.colId === colId &&
      hoverInfo.current.index !== null
    ) {
      targetIndex = hoverInfo.current.index;
    }

    moveCard(activeDrag.colId, colId, activeDrag.index, targetIndex);
    
    // Clear refs
    hoverInfo.current = null;
    setActiveDrag(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, colId: string) => {
    // If the hoverInfo is empty or targets another column, reset it to target this column at the end
    if (!hoverInfo.current || hoverInfo.current.colId !== colId) {
      hoverInfo.current = { colId, index: null };
    }
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>
          Kanban<span>Board</span>
        </h1>
        <div className="board-meta" data-testid="board-title-meta">
          Active Workspace MVP
        </div>
      </header>

      <div className="board-container" data-testid="kanban-board">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => handleColumnDragOver(e, column.id)}
            style={{ display: "contents" }}
          >
            <KanbanColumn
              column={column}
              onRename={renameColumn}
              onDeleteCard={deleteCard}
              onAddCard={addCard}
              onDragStartCard={handleDragStartCard}
              onDragEndCard={handleDragEndCard}
              onDragOverCardInColumn={handleDragOverCardInColumn}
              activeDrag={activeDrag}
              onDropOnColumn={handleDropOnColumn}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

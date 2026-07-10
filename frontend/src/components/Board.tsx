"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState, useLayoutEffect } from "react";
import { initialBoardState } from "@/lib/dummyData";
import { useBoard } from "@/hooks/useBoard";
import type { BoardState, Card as CardType } from "@/lib/types";
import { Column } from "./Column";
import { CardOverlay } from "./Card";

function resolveColumnId(state: BoardState, id: string): string | undefined {
  if (state.columns.some((col) => col.id === id)) return id;
  return state.cards.find((card) => card.id === id)?.columnId;
}

export function Board() {
  const {
    state,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
    getColumnCards,
  } = useBoard(initialBoardState);

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const card = state.cards.find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCardItem = state.cards.find((c) => c.id === activeId);
    if (!activeCardItem) return;

    const overColumnId = resolveColumnId(state, overId);
    if (!overColumnId || activeCardItem.columnId === overColumnId) return;

    const targetCards = state.cards.filter((c) => c.columnId === overColumnId);
    const overCard = state.cards.find((c) => c.id === overId);
    const targetIndex = overCard
      ? targetCards.findIndex((c) => c.id === overId)
      : targetCards.length;

    moveCard(activeId, overColumnId, targetIndex);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeCardItem = state.cards.find((c) => c.id === activeId);
    if (!activeCardItem) return;

    const overCard = state.cards.find((c) => c.id === overId);
    const overColumnId = resolveColumnId(state, overId);
    if (!overColumnId) return;

    if (overCard && activeCardItem.columnId === overCard.columnId) {
      const columnCards = state.cards.filter(
        (c) => c.columnId === activeCardItem.columnId,
      );
      const oldIndex = columnCards.findIndex((c) => c.id === activeId);
      const newIndex = columnCards.findIndex((c) => c.id === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        moveCard(activeId, activeCardItem.columnId, newIndex);
      }
      return;
    }

    if (activeCardItem.columnId !== overColumnId) {
      const targetCards = state.cards.filter(
        (c) => c.columnId === overColumnId,
      );
      const targetIndex = overCard
        ? targetCards.findIndex((c) => c.id === overId)
        : targetCards.length;
      moveCard(activeId, overColumnId, targetIndex);
    }
  }

  if (!isMounted) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="px-6 py-6">
          <h1 className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-foreground/90">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
            Project Board
          </h1>
          <p className="mt-3 text-sm text-gray-text">
            Drag cards between columns to track progress
          </p>
        </header>
        <main className="flex-1 overflow-x-auto px-6 pb-8">
          <div className="flex gap-5">
            {state.columns.map((column) => {
              const cards = getColumnCards(column.id);
              return (
                <div
                  key={column.id}
                  data-column-id={column.id}
                  className="column-shell flex w-72 shrink-0 flex-col rounded-[10px]"
                  data-testid={`column-${column.id}`}
                >
                  <div className="px-3 pt-3 pb-2">
                    <div className="column-pill inline-flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--col-accent-text))]" />
                      <span className="min-w-0 flex-1 truncate">{column.title}</span>
                      <span className="shrink-0 text-xs opacity-70">{cards.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 px-3 pb-3">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="card-shell rounded-[10px] p-3.5"
                        data-testid={`card-${card.id}`}
                      >
                        <p className="truncate text-sm font-medium text-foreground">{card.title}</p>
                        {card.details && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-gray-text">{card.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" data-testid="board-ready">
      <header className="px-6 py-6">
        <h1 className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-foreground/90">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
          Project Board
        </h1>
        <p className="mt-3 text-sm text-gray-text">
          Drag cards between columns to track progress
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex-1 overflow-x-auto px-6 pb-8">
          <div className="flex gap-5">
            {state.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                cards={getColumnCards(column.id)}
                onRename={renameColumn}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
              />
            ))}
          </div>
        </main>

        <DragOverlay>
          {activeCard ? (
            <div
              data-column-id={activeCard.columnId}
              className="cursor-grabbing opacity-95"
            >
              <CardOverlay card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

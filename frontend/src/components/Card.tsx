"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";

type CardContentProps = {
  card: CardType;
  onDelete?: (cardId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isOverlay?: boolean;
};

function CardContent({
  card,
  onDelete,
  dragHandleProps,
  isOverlay,
}: CardContentProps) {
  return (
    <div
      className={`card-shell group relative rounded-[10px] p-3.5 ${
        isOverlay ? "is-dragging z-10" : ""
      }`}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none text-white/25 transition-colors hover:text-white/50 active:cursor-grabbing"
          aria-label={`Drag ${card.title}`}
          {...dragHandleProps}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="10" cy="3" r="1.5" />
            <circle cx="4" cy="7" r="1.5" />
            <circle cx="10" cy="7" r="1.5" />
            <circle cx="4" cy="11" r="1.5" />
            <circle cx="10" cy="11" r="1.5" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium leading-snug text-foreground">
            {card.title}
          </h3>
          {card.details && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-text">
              {card.details}
            </p>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            aria-label={`Delete ${card.title}`}
            className="shrink-0 rounded-md p-1 text-white/20 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400/80 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15 group-hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M2 4h10M5 4V2.5h4V4M5.5 6v4M8.5 6v4M3.5 4l.5 7.5h6l.5-7.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

type CardProps = {
  card: CardType;
  onDelete: (cardId: string) => void;
};

export function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CardContent
        card={card}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function CardOverlay({ card }: { card: CardType }) {
  return <CardContent card={card} isOverlay />;
}

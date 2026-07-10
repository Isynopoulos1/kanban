export type Card = {
  id: string;
  title: string;
  details: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
};

export type BoardState = {
  columns: Column[];
  cards: Card[];
};

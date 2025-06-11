// frontend/src/types/index.ts
export interface Card {
  _id?: string;
  text: string;
  author: string;
  votes: number;
  createdAt: Date;
}

export interface Column {
  _id?: string;
  title: string;
  cards: Card[];
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  columns: Column[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ApiError {
  message: string;
}

// backend/src/models/Board.ts
import mongoose, { Schema, Document } from "mongoose";

// Card interface
export interface ICard extends Document {
  text: string;
  author: string;
  votes: number;
  createdAt: Date;
}

// Column interface
export interface IColumn extends Document {
  title: string;
  cards: ICard[];
}

// Board interface
export interface IBoard extends Document {
  title: string;
  description?: string;
  columns: IColumn[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

// Card Schema
const CardSchema: Schema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Column Schema
const ColumnSchema: Schema = new Schema({
  title: { type: String, required: true },
  cards: [CardSchema],
});

// Board Schema
const BoardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  columns: [ColumnSchema],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<IBoard>("Board", BoardSchema);

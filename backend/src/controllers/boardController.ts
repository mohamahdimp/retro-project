// backend/src/controllers/boardController.ts
import { Request, Response } from "express";
import Board, { IBoard } from "../models/Board";

// Get all boards
export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.status(200).json(boards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single board by id
export const getBoardById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }
    res.status(200).json(board);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new board
export const createBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, createdBy } = req.body;

    // Default columns for retrospective
    const defaultColumns = [
      { title: "What went well", cards: [] },
      { title: "What could be improved", cards: [] },
      { title: "Action items", cards: [] },
    ];

    const newBoard = new Board({
      title,
      description,
      createdBy,
      columns: defaultColumns,
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Add a card to a column
export const addCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId, columnIndex } = req.params;
    const { text, author } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const colIndex = parseInt(columnIndex);
    if (colIndex < 0 || colIndex >= board.columns.length) {
      res.status(400).json({ message: "Invalid column index" });
      return;
    }

    const newCard = {
      text,
      author,
      votes: 0,
      createdAt: new Date(),
    };

    board.columns[colIndex].cards.push(newCard);
    await board.save();

    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Vote on a card
export const voteOnCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { boardId, columnIndex, cardIndex } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const colIndex = parseInt(columnIndex);
    const crdIndex = parseInt(cardIndex);

    if (
      colIndex < 0 ||
      colIndex >= board.columns.length ||
      crdIndex < 0 ||
      crdIndex >= board.columns[colIndex].cards.length
    ) {
      res.status(400).json({ message: "Invalid column or card index" });
      return;
    }

    board.columns[colIndex].cards[crdIndex].votes += 1;
    await board.save();

    res.status(200).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a board
export const deleteBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

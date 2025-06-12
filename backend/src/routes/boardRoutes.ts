// backend/src/routes/boardRoutes.ts
import express from "express";
import {
  getBoards,
  getBoardById,
  createBoard,
  addCard,
  voteOnCard,
  deleteBoard,
} from "../controllers/boardController";

const router = express.Router();

// GET all boards
router.get("/", getBoards);

// GET a single board
router.get("/:id", getBoardById);

// POST create a new board
router.post("/", createBoard);

// POST add a card to a column
router.post("/:boardId/columns/:columnIndex/cards", addCard);

// PUT vote on a card
router.put("/:boardId/columns/:columnIndex/cards/:cardIndex/vote", voteOnCard);

// DELETE a board
router.delete("/:id", deleteBoard);

export default router;

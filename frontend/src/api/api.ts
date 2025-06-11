// frontend/src/api/api.ts
import axios from "axios";
import { Board } from "../types";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBoards = async (): Promise<Board[]> => {
  const response = await api.get("/boards");
  return response.data;
};

export const getBoardById = async (id: string): Promise<Board> => {
  const response = await api.get(`/boards/${id}`);
  return response.data;
};

export const createBoard = async (boardData: {
  title: string;
  description?: string;
  createdBy: string;
}): Promise<Board> => {
  const response = await api.post("/boards", boardData);
  return response.data;
};

export const addCard = async (
  boardId: string,
  columnIndex: number,
  cardData: { text: string; author: string }
): Promise<Board> => {
  const response = await api.post(
    `/boards/${boardId}/columns/${columnIndex}/cards`,
    cardData
  );
  return response.data;
};

export const voteOnCard = async (
  boardId: string,
  columnIndex: number,
  cardIndex: number
): Promise<Board> => {
  const response = await api.put(
    `/boards/${boardId}/columns/${columnIndex}/cards/${cardIndex}/vote`
  );
  return response.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await api.delete(`/boards/${id}`);
};

export default api;

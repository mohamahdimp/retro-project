// frontend/src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBoards, createBoard } from "../api/api";
import { Board } from "../types";
import "./HomePage.css";

const HomePage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch boards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newBoard = await createBoard({
        title,
        description,
        createdBy: "Anonymous User", // This would be the logged-in user in a real app
      });
      setBoards([newBoard, ...boards]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError("Failed to create board");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Retrospective Boards</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create New Board"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="board-form">
          <form onSubmit={handleCreateBoard}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Board
            </button>
          </form>
        </div>
      )}

      <div className="boards-list">
        {boards.length === 0 ? (
          <p>No boards yet. Create one to get started!</p>
        ) : (
          boards.map((board) => (
            <div key={board._id} className="board-item">
              <h3>{board.title}</h3>
              {board.description && <p>{board.description}</p>}
              <div className="board-meta">
                <span>
                  Created: {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/board/${board._id}`} className="btn btn-view">
                View Board
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;

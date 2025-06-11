// frontend/src/pages/BoardPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById, addCard, voteOnCard, deleteBoard } from "../api/api";
import { Board, Column } from "../types";
import "./BoardPage.css";

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCardTexts, setNewCardTexts] = useState<Record<number, string>>({});

  useEffect(() => {
    if (id) {
      fetchBoard(id);
    }
  }, [id]);

  const fetchBoard = async (boardId: string) => {
    try {
      setLoading(true);
      const data = await getBoardById(boardId);
      setBoard(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch board");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (columnIndex: number) => {
    if (!board || !id) return;

    const text = newCardTexts[columnIndex]?.trim();
    if (!text) return;

    try {
      const updatedBoard = await addCard(id, columnIndex, {
        text,
        author: "Anonymous User", // This would be the logged-in user in a real app
      });
      setBoard(updatedBoard);
      // Clear the input field
      setNewCardTexts({
        ...newCardTexts,
        [columnIndex]: "",
      });
    } catch (err) {
      setError("Failed to add card");
      console.error(err);
    }
  };

  const handleVote = async (columnIndex: number, cardIndex: number) => {
    if (!board || !id) return;

    try {
      const updatedBoard = await voteOnCard(id, columnIndex, cardIndex);
      setBoard(updatedBoard);
    } catch (err) {
      setError("Failed to vote on card");
      console.error(err);
    }
  };

  const handleDeleteBoard = async () => {
    if (!board || !id) return;

    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        await deleteBoard(id);
        navigate("/");
      } catch (err) {
        setError("Failed to delete board");
        console.error(err);
      }
    }
  };

  const handleCardTextChange = (columnIndex: number, value: string) => {
    setNewCardTexts({
      ...newCardTexts,
      [columnIndex]: value,
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!board) {
    return <div className="not-found">Board not found</div>;
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div>
          <h2>{board.title}</h2>
          {board.description && (
            <p className="board-description">{board.description}</p>
          )}
        </div>
        <button className="btn btn-danger" onClick={handleDeleteBoard}>
          Delete Board
        </button>
      </div>

      <div className="columns-container">
        {board.columns.map((column, columnIndex) => (
          <div key={columnIndex} className="column">
            <h3>{column.title}</h3>
            <div className="cards">
              {column.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="card">
                  <p>{card.text}</p>
                  <div className="card-footer">
                    <span className="author">By: {card.author}</span>
                    <div className="votes">
                      <span>{card.votes} votes</span>
                      <button
                        className="vote-btn"
                        onClick={() => handleVote(columnIndex, cardIndex)}
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="add-card">
              <textarea
                placeholder={`Add to ${column.title}...`}
                value={newCardTexts[columnIndex] || ""}
                onChange={(e) =>
                  handleCardTextChange(columnIndex, e.target.value)
                }
              />
              <button
                className="btn btn-primary"
                onClick={() => handleAddCard(columnIndex)}
                disabled={!newCardTexts[columnIndex]?.trim()}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;

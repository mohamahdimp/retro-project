// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

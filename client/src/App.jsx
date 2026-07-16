import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";
import CapturePage from "./pages/CapturePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CapturePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

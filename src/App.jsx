// src/App.jsx
import { BrowserRouter, Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import SpeakingPage from "./pages/Speaking";
import Listening from "./pages/Listening";
import MarketPage from "./pages/MarketPage";
import TextHighlighter from "./components/HighlightableText"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/m" element={<TextHighlighter/>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <PrivateRoute>
              <Reading />
            </PrivateRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <PrivateRoute>
              <Writing />
            </PrivateRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <PrivateRoute>
              <SpeakingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listening"
          element={
            <PrivateRoute>
              <Listening />
            </PrivateRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

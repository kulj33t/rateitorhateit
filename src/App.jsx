import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SeriesDetails from "./pages/SeriesDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-bgcolor text-dark font-sans transition-colors duration-300">
          <Navbar />
          <div className="container mx-auto px-4 py-6 pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/series/:id" element={<SeriesDetails />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

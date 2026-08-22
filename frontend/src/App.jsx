import {
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";


function App() {
  return (
    <>
  <Navbar />

  <Routes>

    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/about"
      element={<About />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="*"
      element={<NotFound />}
    />

  </Routes>

  <Footer />
</>
  );
}

export default App;
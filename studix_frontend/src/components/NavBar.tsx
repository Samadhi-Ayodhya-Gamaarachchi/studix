// components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Studix</h1>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

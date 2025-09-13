// components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors duration-200">
          Studix
        </h1>
        <div className="flex items-center space-x-6">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-500/20"
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-500/20"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-500/20"
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-500/20"
              >
                Tasks
              </Link>
              <Link 
                to="/profile" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-blue-500/20"
              >
                Profile
              </Link>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
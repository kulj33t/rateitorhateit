import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-white/5 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight flex items-center gap-2 group"
        >
          <span className="text-white group-hover:text-medium transition-colors">
            Rate
          </span>
          <span className="bg-linear-to-r from-teal-400 to-emerald-400 text-transparent bg-clip-text">
            It
          </span>
        </Link>

        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-medium transition-colors">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {user.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-linear-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

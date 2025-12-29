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
    <nav className="bg-dark text-bgcolor px-6 py-4 shadow-lg flex justify-between items-center fixed top-0 left-0 z-50 w-full">
      <Link
        to="/"
        className="text-2xl font-bold tracking-wider hover:text-light transition-colors"
      >
        RateIt
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* Profile link (avatar + username) */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-medium transition"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-light"
                />
              ) : (
                <div className="w-8 h-8 bg-medium rounded-full flex items-center justify-center text-xs text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-light hidden sm:block">
                {user.username}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded border border-bgcolor hover:bg-bgcolor hover:text-dark transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded hover:bg-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-light text-dark font-bold hover:bg-opacity-90 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

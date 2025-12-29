import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/series/my-ratings");
        setMyRatings(data.data);
      } catch (error) {
        console.error("Failed to fetch ratings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <div className="text-center mt-10">Please login.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 pb-20">
      {/* ## Profile Header */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-medium flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-inner">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-dark">{user.username}</h1>
          <p className="text-medium">{user.email}</p>
          <div className="mt-4 flex gap-4 justify-center md:justify-start">
            <div className="bg-bgcolor px-4 py-2 rounded-lg">
              <span className="block font-bold text-dark text-xl">
                {myRatings.length}
              </span>
              <span className="text-xs text-gray-500">Rated</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 border-2 border-red-500 text-red-500 font-bold rounded hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* ## Activity List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-dark mb-4">Your Rankings</h2>

        {loading ? (
          <div className="text-center p-10">Loading...</div>
        ) : myRatings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            You haven't rated any series yet.
            <br />
            <Link
              to="/"
              className="text-medium font-bold hover:underline mt-2 inline-block"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRatings.map((rating) => (
              <Link
                to={`/series/${rating.series._id}`}
                key={rating._id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition border border-transparent hover:border-light"
              >
                <img
                  src={rating.series.coverImage}
                  alt={rating.series.title}
                  className="w-12 h-16 object-cover rounded shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-dark truncate">
                    {rating.series.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Rated on {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-medium text-white font-bold rounded-full">
                  {rating.rank}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

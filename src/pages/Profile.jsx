import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../services/api";

// 1. Reusing the Gradient Map for consistent branding
const rankGradients = {
  SSS: "from-purple-500 to-pink-600",
  SS: "from-blue-400 to-blue-600",
  S: "from-teal-400 to-teal-600",
  A: "from-green-400 to-emerald-600",
  B: "from-yellow-300 to-amber-500",
  C: "from-orange-400 to-red-400",
  D: "from-red-500 to-rose-700",
  F: "from-gray-400 to-gray-600",
};

// 2. Updated Section Component with "Empty State" UI
const Section = ({ title, items, emptyMsg, icon }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
      <span className="w-1.5 h-8 bg-gradient-to-b from-medium to-dark rounded-full"></span>
      {title}
    </h2>

    {!items || items.length === 0 ? (
      // ✨ New Visual Empty State
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition">
        <div className="text-5xl mb-4 grayscale opacity-50">{icon}</div>
        <p className="text-gray-500 font-medium">{emptyMsg}</p>
        <Link
          to="/"
          className="mt-4 text-sm font-bold text-medium hover:underline"
        >
          Browse Series →
        </Link>
      </div>
    ) : (
      // ✨ Refined Grid & Cards
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <Link
            to={`/series/${item.series?._id}`}
            key={item._id}
            className="group relative flex flex-col"
          >
            {/* Poster Container */}
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 bg-gray-200">
              <img
                src={
                  item.series?.coverImage ||
                  "https://via.placeholder.com/300x450"
                }
                alt={item.series?.title || "Unknown Series"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay Gradient (Subtle) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Title */}
            <h4 className="font-bold text-dark text-sm mt-3 truncate group-hover:text-medium transition-colors">
              {item.series?.title || "Unknown"}
            </h4>

            {/* ✨ Gradient Rank Badge (Only if rated) */}
            {item.rank && (
              <div
                className={`
                mt-1 self-start px-2 py-0.5 rounded text-[10px] font-black text-white tracking-wide shadow-sm
                bg-gradient-to-r ${
                  rankGradients[item.rank] || "from-gray-400 to-gray-500"
                }
              `}
              >
                RANK {item.rank}
              </div>
            )}
          </Link>
        ))}
      </div>
    )}
  </div>
);

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Safety: Initialize with empty arrays to prevent crashes
  const [data, setData] = useState({ watching: [], watchLater: [], rated: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const response = await api.get("/series/my-profile");
        // Safety check to ensure we don't crash on null data
        if (response.data && response.data.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-dark">
        Please login.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 pb-20 px-4">
      {/* ## Profile Card (Same Logic, Better Style) */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-medium opacity-5 rounded-full blur-3xl"></div>

        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl ring-4 ring-white flex-shrink-0 z-10">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-dark flex items-center justify-center text-white text-5xl font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>

        {/* Info & Stats */}
        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-4xl font-black text-dark tracking-tight">
            {user.username}
          </h1>
          <p className="text-medium text-lg font-medium opacity-80">
            {user.email}
          </p>

          <div className="flex justify-center md:justify-start gap-10 mt-6">
            <div className="text-center group cursor-default">
              <span className="block font-black text-3xl text-dark group-hover:text-medium transition-colors">
                {data.watching ? data.watching.length : 0}
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Watching
              </span>
            </div>
            <div className="text-center group cursor-default">
              <span className="block font-black text-3xl text-dark group-hover:text-medium transition-colors">
                {data.watchLater ? data.watchLater.length : 0}
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Watchlist
              </span>
            </div>
            <div className="text-center group cursor-default">
              <span className="block font-black text-3xl text-dark group-hover:text-medium transition-colors">
                {data.rated ? data.rated.length : 0}
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Rated
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-8 py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition active:scale-95 z-10"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="text-center p-20 text-gray-400 font-medium">
          Loading your library...
        </div>
      ) : (
        <div className="space-y-4">
          <Section
            title="Continue Watching"
            items={data.watching || []}
            emptyMsg="You aren't watching anything right now."
            icon="📺"
          />

          <Section
            title="Watch Later"
            items={data.watchLater || []}
            emptyMsg="Your watchlist is empty."
            icon="🔖"
          />

          <Section
            title="Rated Shows"
            items={data.rated || []}
            emptyMsg="You haven't rated any shows yet."
            icon="⭐"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;

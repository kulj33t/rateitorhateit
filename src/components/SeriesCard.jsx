import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/AuthContext";

const SeriesCard = ({ series }) => {
  const { user } = useContext(AuthContext);

  // Local state for instant visual feedback (Optimistic UI)
  const [likes, setLikes] = useState(series.simpleLikes);
  const [hates, setHates] = useState(series.simpleHates);
  const [isVoting, setIsVoting] = useState(false);

  const handleTap = async (type, e) => {
    e.preventDefault(); // Prevent clicking the card link
    if (!user) {
      alert("Please login to vote!");
      return;
    }
    if (isVoting) return;

    // Optimistic Update (Update UI before API responds for speed)
    if (type === "like") setLikes((prev) => prev + 1);
    else setHates((prev) => prev + 1);

    setIsVoting(true);
    try {
      await api.post(`/series/${series._id}/tap`, { type });
      // In a real app, you might sync the exact count from server here
    } catch (error) {
      // Revert if error
      if (type === "like") setLikes((prev) => prev - 1);
      else setHates((prev) => prev - 1);
      console.error("Vote failed", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-light transition-shadow hover:shadow-2xl"
    >
      <Link to={`/series/${series._id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={series.coverImage || "https://via.placeholder.com/300x450"}
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          {/* Rank Badge (Only shows if rated) */}
          {series.averageRating > 0 && (
            <div className="absolute top-2 right-2 bg-dark text-paperCream font-bold px-3 py-1 rounded-full shadow-md">
              {series.rankLabel}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-bold text-dark text-lg truncate mb-1">
          {series.title}
        </h3>
        <p className="text-sm text-medium mb-4 line-clamp-2 min-h-[40px]">
          {series.description}
        </p>

        {/* The Tap Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => handleTap("like", e)}
            className="flex-1 bg-medium text-white py-2 rounded-lg font-semibold hover:opacity-90 transition active:scale-95 flex justify-center items-center gap-2"
          >
            <span>❤️</span> {likes}
          </button>

          <button
            onClick={(e) => handleTap("hate", e)}
            className="flex-1 bg-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition active:scale-95 flex justify-center items-center gap-2"
          >
            <span>💔</span> {hates}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesCard;

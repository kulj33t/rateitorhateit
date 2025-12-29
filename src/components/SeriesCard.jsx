import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const rankGradients = {
  SSS: "from-purple-500 to-pink-600 shadow-purple-500/50",
  SS: "from-blue-400 to-blue-600 shadow-blue-500/50",
  S: "from-teal-400 to-teal-600 shadow-teal-500/50",
  A: "from-green-400 to-emerald-600 shadow-green-500/50",
  B: "from-yellow-300 to-amber-500 shadow-yellow-500/50",
  C: "from-orange-400 to-red-400 shadow-orange-500/50",
  D: "from-red-500 to-rose-700 shadow-red-500/50",
  F: "from-gray-400 to-gray-600 shadow-gray-500/50",
};

const SeriesCard = ({ series }) => {
  return (
    <Link to={`/series/${series._id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col"
      >
        <div className="relative aspect-2/3 overflow-hidden bg-gray-200">
          <img
            src={series.coverImage || "https://via.placeholder.com/300x450"}
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {series.averageRating > 0 && (
            <div
              className={`
              absolute top-3 right-3 text-xs font-black text-white px-3 py-1 rounded-full shadow-lg tracking-wider
              bg-linear-to-r ${
                rankGradients[series.rankLabel] || "from-gray-700 to-black"
              }
            `}
            >
              {series.rankLabel}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-dark text-lg leading-tight mb-2 line-clamp-1 group-hover:text-medium transition-colors">
            {series.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
            {series.description}
          </p>

          <div className="flex justify-between items-center text-xs font-medium text-gray-400 pt-3 border-t border-gray-100">
            <span>
              {series.releaseDate
                ? new Date(series.releaseDate).getFullYear()
                : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {series.voteCount} votes
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default SeriesCard;

import { motion } from "framer-motion";

// Gradients for the Orb Buttons
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

// Solid Colors for the Chart Bars
const solidColors = {
  SSS: "bg-purple-600",
  SS: "bg-blue-500",
  S: "bg-teal-500",
  A: "bg-green-500",
  B: "bg-yellow-400",
  C: "bg-orange-500",
  D: "bg-red-600",
  F: "bg-gray-500",
};

const Rating = ({ series, onRate, selectedRank, isSubmitting }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Rate this Series
      </h3>

      {/* 1. Gradient Orb Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-8 justify-items-center">
        {Object.keys(rankGradients).map((rank) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            key={rank}
            onClick={() => onRate(rank)}
            disabled={isSubmitting}
            className={`
              w-12 h-12 rounded-full font-black text-sm text-white shadow-lg transition-all
              bg-gradient-to-br ${rankGradients[rank]}
              ${
                selectedRank === rank
                  ? "ring-4 ring-offset-2 ring-gray-900 scale-110"
                  : "opacity-90 hover:opacity-100"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {rank}
          </motion.button>
        ))}
      </div>

      {/* 2. Community Stats Bars */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
          Community Consensus
        </h4>
        {Object.keys(solidColors)
          .reverse()
          .map((rank) => {
            const count = series.ratingDistribution?.[rank] || 0;
            const percentage =
              series.voteCount > 0 ? (count / series.voteCount) * 100 : 0;

            if (percentage === 0 && series.voteCount > 5) return null;

            return (
              <div key={rank} className="flex items-center gap-3 group">
                <span className="w-8 font-bold text-gray-500 text-sm">
                  {rank}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${solidColors[rank]}`}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Rating;

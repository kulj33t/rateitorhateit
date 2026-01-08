import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import SeriesCard from "../components/SeriesCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Home = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularityScore");

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = `?search=${searchTerm}&sort=${sortBy}`;
        const response = await api.get(`/series${query}`);

        if (response.data && Array.isArray(response.data.data)) {
          setSeries(response.data.data);
        } else {
          setSeries([]);
        }
      } catch (err) {
        console.error("Failed to fetch series:", err);
        setError("Unable to load series. The server might be down or busy.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSeries();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy]);

  return (
    <div className="min-h-screen pb-20 max-w-7xl mx-auto px-6">
      <div className="py-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 mb-10">
        <div>
          <h1 className="text-5xl font-black text-dark tracking-tight mb-2">
            Discover
            <span className="text-medium">.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Find your next obsession. Rate, rank, and track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 group-focus-within:text-medium transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search series..."
              className="pl-11 pr-4 py-3 rounded-full border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-medium/20 focus:border-medium w-full md:w-72 transition-all font-medium text-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none px-6 py-3 rounded-full border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-medium/20 focus:border-medium cursor-pointer font-bold text-gray-600 hover:text-medium transition-colors w-full md:w-auto pr-10"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularityScore">Most Popular</option>
              <option value="top_rated">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 text-medium">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-medium mb-4"></div>
          <p className="font-bold animate-pulse">Fetching library...</p>
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-red-50 rounded-3xl shadow-sm border border-red-100"
        >
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Connection Issue
          </h2>
          <p className="text-red-600 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white text-red-600 font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-red-200"
          >
            Try Refreshing
          </button>
        </motion.div>
      ) : series.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-dark mb-2">
            No series found.
          </h2>
          <p className="text-gray-500">
            We couldn't find anything matching "
            <span className="font-bold text-dark">{searchTerm}</span>".
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-6 text-medium font-bold hover:underline"
          >
            Clear Search
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {series.map((item) => (
            <motion.div key={item._id} variants={itemVariants}>
              <SeriesCard series={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;

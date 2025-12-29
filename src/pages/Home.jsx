import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import SeriesCard from "../components/SeriesCard";

const Home = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularityScore");

  // ## Fetch Data Effect
  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        // Construct query string
        const query = `?search=${searchTerm}&sort=${sortBy}`;
        const { data } = await api.get(`/series${query}`);
        setSeries(data.data);
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to prevent API spam while typing
    const timeoutId = setTimeout(() => {
      fetchSeries();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy]);

  // ## Render
  return (
    <div className="min-h-screen">
      {/* ## Header & Controls */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-dark mb-2">Explore Series</h1>
          <p className="text-medium">Rate, Rank, and Discover.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search anime or tv..."
            className="px-4 py-2 rounded-lg border-2 border-light bg-white focus:outline-none focus:border-medium w-full md:w-64 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Sort Dropdown */}
          <select
            className="px-4 py-2 rounded-lg border-2 border-light bg-white focus:outline-none focus:border-medium cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularityScore">Most Popular</option>
            <option value="top_rated">Top Rated (Avg)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* ## Content Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-medium"></div>
        </div>
      ) : (
        <>
          {series.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-2xl font-bold">No series found.</h2>
              <p>Try searching for something else.</p>
            </div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {series.map((item) => (
                <SeriesCard key={item._id} series={item} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

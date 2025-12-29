import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import Rating from "../components/Rating";

const SeriesDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [libraryStatus, setLibraryStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/series/${id}`);
        setSeries(data.data);
      } catch (error) {
        console.error("Error fetching series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleLibraryAction = async (status) => {
    if (!user) return alert("Please login to use the library!");
    const newStatus = libraryStatus === status ? "remove" : status;
    setLibraryStatus(newStatus === "remove" ? null : newStatus);

    try {
      await api.post(`/series/${id}/library`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update library:", error);
    }
  };

  const handleRankSubmit = async (rank) => {
    if (!user) return alert("Please login to rank!");
    setSubmitting(true);
    setSelectedRank(rank);

    try {
      const { data } = await api.post(`/series/${id}/rank`, { rank });
      setSeries(data.data);
    } catch (error) {
      alert(error.response?.data?.error || "Ranking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-dark font-bold">
        Loading...
      </div>
    );
  if (!series)
    return <div className="text-center mt-20">Series not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: `url(${
              series.backdropImage || series.coverImage
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12 flex flex-col md:flex-row gap-8 items-end">
            <motion.img
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={series.coverImage}
              alt={series.title}
              className="hidden md:block w-48 rounded-lg shadow-2xl border-4 border-white/10"
            />

            <div className="flex-1 text-white">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-6xl font-black mb-2 tracking-tight"
              >
                {series.title}
              </motion.h1>

              <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-300 mb-6">
                {series.releaseDate && (
                  <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">
                    {new Date(series.releaseDate).getFullYear()}
                  </span>
                )}
                {series.genres?.map((g) => (
                  <span
                    key={g}
                    className="border border-white/30 px-2 py-0.5 rounded"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleLibraryAction("watching")}
                  className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                    libraryStatus === "watching"
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white ring-2 ring-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {libraryStatus === "watching"
                    ? "✓ Watching"
                    : "▶ Start Watching"}
                </button>

                <button
                  onClick={() => handleLibraryAction("watch_later")}
                  className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg ${
                    libraryStatus === "watch_later"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white ring-2 ring-white"
                      : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {libraryStatus === "watch_later"
                    ? "✓ In Library"
                    : "+ Watchlist"}
                </button>
              </div>
            </div>

            <div className="hidden md:block text-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Rank
              </div>
              <div className="text-5xl font-black text-white">
                {series.rankLabel || "-"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {series.voteCount} Votes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-yellow-400 rounded-full"></span>
              Overview
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {series.description}
            </p>
          </section>

          {series.trailerUrl && (
            <section className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${
                    series.trailerUrl.split("v=")[1]?.split("&")[0]
                  }`}
                  title="Trailer"
                  allowFullScreen
                  className="border-none"
                ></iframe>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Replaced with Clean Component */}
        <div className="lg:col-span-1">
          <Rating
            series={series}
            onRate={handleRankSubmit}
            selectedRank={selectedRank}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;

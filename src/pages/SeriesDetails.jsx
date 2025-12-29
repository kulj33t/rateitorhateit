import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import AuthContext from "../context/AuthContext";

const rankColors = {
  F: "bg-gray-400",
  D: "bg-red-500",
  C: "bg-orange-400",
  B: "bg-yellow-400",
  A: "bg-green-400",
  S: "bg-teal-400",
  SS: "bg-blue-500",
  SSS: "bg-purple-600",
};

const SeriesDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRank, setSelectedRank] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRankSubmit = async (rank) => {
    if (!user) return alert("Please login to rank!");
    setSubmitting(true);
    setSelectedRank(rank);

    try {
      const { data } = await api.post(`/series/${id}/rank`, { rank });
      setSeries(data.data);
    } catch (error) {
      alert(error.response?.data?.error || "Ranking failed");
      setSelectedRank(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!series)
    return <div className="text-center mt-20">Series not found.</div>;

  return (
    <div className="bg-bgcolor min-h-screen pb-20">
      <div
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${series.backdropImage || series.coverImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end">
          <div className="container mx-auto px-4 pb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-2"
            >
              {series.title}
            </motion.h1>
            <div className="flex gap-4 text-gray-300">
              {series.genres?.map((g) => (
                <span
                  key={g}
                  className="border border-gray-500 px-2 rounded text-sm"
                >
                  {g}
                </span>
              ))}
              <span>
                •{" "}
                {series.releaseDate
                  ? new Date(series.releaseDate).getFullYear()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={series.coverImage}
            alt={series.title}
            className="w-full rounded-xl shadow-2xl border-4 border-white mb-6"
          />

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              Average Rank
            </div>
            <div className={`text-6xl font-black my-2 text-dark`}>
              {series.rankLabel || "N/A"}
            </div>
            <div className="text-medium text-sm">{series.voteCount} Votes</div>

            <div className="flex justify-center gap-8 mt-4 border-t pt-4">
              <div>
                <span className="text-red-500 text-xl">❤️</span>{" "}
                {series.simpleLikes}
              </div>
              <div>
                <span className="text-dark text-xl">💔</span>{" "}
                {series.simpleHates}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-dark mb-3">Overview</h3>
            <p className="text-dark leading-relaxed">{series.description}</p>
          </div>

          {series.trailerUrl && (
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${
                  series.trailerUrl.split("v=")[1]?.split("&")[0]
                }`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-medium">
            <h3 className="text-2xl font-bold text-dark mb-6">
              Rate this Series
            </h3>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {Object.keys(rankColors).map((rank) => (
                <button
                  key={rank}
                  onClick={() => handleRankSubmit(rank)}
                  disabled={submitting}
                  className={`
                    w-12 h-12 rounded-full font-bold text-white shadow-md transition-transform hover:scale-110 active:scale-95
                    ${rankColors[rank]} 
                    ${
                      selectedRank === rank
                        ? "ring-4 ring-offset-2 ring-dark"
                        : ""
                    }
                  `}
                >
                  {rank}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-dark">Community Consensus</h4>
              {Object.keys(rankColors)
                .reverse()
                .map((rank) => {
                  const count = series.ratingDistribution?.[rank] || 0;
                  const percentage =
                    series.voteCount > 0 ? (count / series.voteCount) * 100 : 0;

                  return (
                    <div key={rank} className="flex items-center gap-3">
                      <span className="w-8 font-bold text-right text-sm">
                        {rank}
                      </span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${rankColors[rank]}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;

"use client";

import { useState, useEffect } from "react";
import { getTopics } from "../../service/topicService"; // Adjust path if necessary
import TopicCard from "../../components/topics/TopicCard"; // Ensure this is the styled version
import { FiSearch, FiAlertCircle, FiInbox, FiLoader, FiXCircle } from "react-icons/fi"; // Icons
import { motion } from "framer-motion"; // For subtle animations

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64 text-slate-400">
    <FiLoader className="animate-spin h-12 w-12 text-indigo-400 mb-4" />
    <p className="text-lg">Loading Topics...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-5 rounded-lg shadow-md flex items-start space-x-3">
    <FiAlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
    <div>
        <h4 className="font-semibold text-red-200">Oops! Something went wrong.</h4>
        <p className="text-sm">{message}</p>
    </div>
  </div>
);

const EmptyState = ({ message, subMessage }) => (
  <div className="text-center py-16 px-6 bg-slate-800/50 rounded-xl shadow-sm">
    <FiInbox className="mx-auto h-16 w-16 text-slate-500 mb-4" />
    <h3 className="text-xl font-semibold text-slate-300">{message}</h3>
    <p className="mt-2 text-sm text-slate-400">{subMessage}</p>
  </div>
);

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const data = await getTopics();
        // Simulate a slight delay for better UX if loading is too fast
        // await new Promise(resolve => setTimeout(resolve, 500));
        setTopics(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load topics. Please check your connection and try again.");
        console.error("Error fetching topics:", err);
        setTopics([]); // Ensure topics is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-slate-900 min-h-screen text-slate-100 px-4 sm:px-6 lg:px-8 py-10 md:py-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            Explore Programming Topics
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Dive into our curated collection. Each topic is packed with problems and resources
            to help you master specific concepts and coding techniques.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 md:mb-12 max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-10 py-3 border border-slate-700 rounded-lg
                         leading-5 bg-slate-800 placeholder-slate-500 text-slate-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-shadow duration-150 shadow-sm hover:shadow-md focus:shadow-lg"
              placeholder="Search topics (e.g., Arrays, Graphs...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search topics"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
                aria-label="Clear search"
              >
                <FiXCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : filteredTopics.length === 0 ? (
            <EmptyState
              message="No Topics Found"
              subMessage={
                searchQuery
                  ? `We couldn't find any topics matching "${searchQuery}". Try a different search term.`
                  : "It seems there are no topics available at the moment. Please check back later!"
              }
            />
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <TopicCard topic={topic} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TopicsPage;
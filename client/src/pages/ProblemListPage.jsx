"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../service/api"; // Adjust path if necessary
import {
  FiSearch, FiAlertCircle, FiInbox, FiLoader, FiXCircle, FiCheckCircle,
  FiAlertTriangle, FiFilter, FiTag, FiChevronDown, FiFileText, FiList, FiArrowRight, FiCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- Reusable UI Components (Keep these as they are good) ---
const LoadingState = ({ text = "Loading Problems..." }) => (
  <div className="flex flex-col justify-center items-center h-64 text-slate-400 py-10">
    <FiLoader className="animate-spin h-10 w-10 text-indigo-400 mb-3" />
    <p className="text-sm">{text}</p>
  </div>
);

const ErrorState = ({ message, title = "Error Loading Data" }) => (
  <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-5 py-4 rounded-lg shadow-md flex items-start space-x-3 my-6">
    <FiAlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-red-200 text-sm">{title}</h4>
      <p className="text-xs">{message}</p>
    </div>
  </div>
);

const EmptyState = ({ message, subMessage = "Try adjusting your filters or search term." }) => (
  <div className="text-center py-12 px-6 bg-slate-800/50 rounded-xl shadow-sm my-6">
    <FiInbox className="mx-auto h-12 w-12 text-slate-500 mb-3" />
    <h3 className="text-lg font-semibold text-slate-300">{message}</h3>
    <p className="mt-1 text-xs text-slate-400">{subMessage}</p>
  </div>
);

const FilterSelect = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="mb-5">
    <label className="block mb-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center">
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5"/>}
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full appearance-none bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-md
                   px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-shadow duration-150 shadow-sm hover:border-slate-500"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-700 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);
// --- End Reusable UI Components ---


// --- NEW: ProblemCard Component ---
const ProblemCard = ({ problem }) => {
  const getDifficultyStyles = (level = "") => {
    switch (level.toLowerCase()) {
      case "easy": return { text: "text-green-300", bgDot: "bg-green-400", border: "border-green-500/30 hover:border-green-500/70" };
      case "medium": return { text: "text-yellow-300", bgDot: "bg-yellow-400", border: "border-yellow-500/30 hover:border-yellow-500/70" };
      case "hard": return { text: "text-red-300", bgDot: "bg-red-400", border: "border-red-500/30 hover:border-red-500/70" };
      default: return { text: "text-slate-400", bgDot: "bg-slate-500", border: "border-slate-700 hover:border-slate-500/70" };
    }
  };

  const difficultyStyles = getDifficultyStyles(problem.difficulty);

  const getStatusIcon = (problemStatus = "") => {
    if (problemStatus) {
        switch (problemStatus.toLowerCase()) {
            case "solved": return <FiCheckCircle className="w-4 h-4 text-green-400" title="Solved" />;
            case "attempted": return <FiAlertTriangle className="w-4 h-4 text-yellow-400" title="Attempted" />;
            case "unsolved": return <FiCircle className="w-4 h-4 text-slate-500" title="Unsolved" />;
        }
    }
    return null;
  };

  return (
    <Link
      to={`/problems/${problem._id}`} // Or your specific solve page route
      className={`group block h-full relative transition-all duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-xl`}
      aria-label={`View problem: ${problem.title}`}
    >
      <div className={`h-full bg-slate-800 rounded-xl shadow-lg overflow-hidden border 
                       ${difficultyStyles.border}
                       flex flex-col`}>
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 leading-tight">
              {problem.title}
            </h3>
            <div className="flex-shrink-0 ml-2">
                {getStatusIcon(problem.userStatus)}
            </div>
          </div>

          <div className="flex items-center mb-3">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${difficultyStyles.bgDot}`}></span>
            <span className={`text-xs font-medium ${difficultyStyles.text}`}>
              {problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : "N/A"}
            </span>
          </div>

          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {problem.tags.slice(0, 3).map((tag) => ( // Show max 3 tags
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700 text-slate-400"
                >
                  {tag}
                </span>
              ))}
              {problem.tags?.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-600 text-slate-400">
                      +{problem.tags.length - 3}
                  </span>
              )}
            </div>
          )}
        </div>
        <div className="px-5 py-3 bg-slate-800/50 border-t border-slate-700/50 group-hover:bg-slate-700/60 transition-colors">
             <p className="text-xs text-indigo-400 group-hover:text-indigo-300 font-medium flex items-center justify-end">
                Solve Problem <FiArrowRight className="ml-1 w-3.5 h-3.5 transform transition-transform group-hover:translate-x-0.5" />
            </p>
        </div>
      </div>
    </Link>
  );
};
// --- End ProblemCard Component ---


const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicNotes, setTopicNotes] = useState("");
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true); // For topics & initial notes
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchProblems = useCallback(async () => {
    setLoadingProblems(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (difficulty !== "all") params.append("difficulty", difficulty);
      if (status !== "all") params.append("status", status);
      if (selectedTopic) params.append("topic", selectedTopic);

      const problemsUrl = `/problems${params.toString() ? `?${params.toString()}` : ""}`;
      const problemsRes = await api.get(problemsUrl);
      setProblems(problemsRes.data.problems || []);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.response?.data?.message || "Failed to load problems. Please try again.");
      setProblems([]);
    } finally {
      setLoadingProblems(false);
    }
  }, [searchQuery, difficulty, status, selectedTopic]);

  const fetchTopicNotes = useCallback(async (topicId) => {
    if (!topicId) {
      setTopicNotes("");
      return;
    }
    // Optionally, set a loading state for notes
    try {
      const res = await api.get(`/topics/${topicId}/notes`);
      setTopicNotes(res.data.notes || "");
    } catch (err) {
      console.error("Error fetching topic notes:", err);
      setTopicNotes("<p class='text-sm text-slate-400'>Could not load notes for this topic.</p>");
    }
  }, []);

  useEffect(() => {
    const fetchInitialMeta = async () => {
      setLoadingMeta(true);
      try {
        const topicsRes = await api.get("/topics");
        setTopics(topicsRes.data.topics || []);
        // If a topic is selected via URL param initially, fetch its notes
        // This part would require logic to get initial selectedTopic from URL if needed
      } catch (err) {
        console.error("Error fetching topics:", err);
        // setError for topics if critical, or just log
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchInitialMeta();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    fetchTopicNotes(topicId);
  };

  const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
  const pageTransition = { duration: 0.4 };

  const difficultyOptions = [
    { value: "all", label: "All Difficulties" }, { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" },
  ];
  const statusOptions = [
    { value: "all", label: "All Statuses" }, { value: "solved", label: "Solved" },
    { value: "attempted", label: "Attempted" }, { value: "unsolved", label: "Unsolved" },
  ];

  return (
    <motion.div
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
      className="bg-slate-900 min-h-screen text-slate-200 px-4 sm:px-6 lg:px-8 py-10 md:py-12"
    >
      <div className="max-w-full mx-auto">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            Coding Problems
          </h1>
          <p className="mt-2 text-md text-slate-400 max-w-3xl">
            Sharpen your skills with our diverse collection of algorithmic challenges.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-6 md:sticky md:top-24 md:self-start"> {/* Made sidebar sticky */}
            {loadingMeta ? <LoadingState text="Loading filters..." /> : (
              <>
                <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
                  <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
                    <FiList className="w-5 h-5 mr-2 text-indigo-400"/> Topics
                  </h2>
                  <div className="space-y-1.5 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 pr-1">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 ${selectedTopic === null ? "bg-indigo-500/30 text-indigo-300 font-medium" : "text-slate-300 hover:bg-slate-700/70 hover:text-slate-100"}`}
                      onClick={() => handleTopicChange(null)}
                    >
                      All Topics
                    </button>
                    {topics.map((t) => (
                      <button key={t._id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 ${selectedTopic === t._id ? "bg-indigo-500/30 text-indigo-300 font-medium" : "text-slate-300 hover:bg-slate-700/70 hover:text-slate-100"}`}
                        onClick={() => handleTopicChange(t._id)}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
                  <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                    <FiFilter className="w-5 h-5 mr-2 text-indigo-400"/> Filters
                  </h2>
                  <FilterSelect label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} options={difficultyOptions} icon={FiTag}/>
                  <FilterSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} icon={FiCheckCircle}/>
                </div>
              </>
            )}
          </aside>

          {/* Main Content */}
          <section className="md:col-span-9">
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input type="text"
                  className="block w-full pl-12 pr-10 py-3 border border-slate-700 rounded-lg bg-slate-800 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150 shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Search problems by title or tag..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search problems"
              />
              {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label="Clear search"
                  ><FiXCircle className="h-5 w-5" /></button>
              )}
            </div>

            <AnimatePresence>
            {selectedTopic && topicNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }} // 1.5rem is mb-6
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800 p-5 rounded-xl shadow-lg overflow-hidden" // mb-6 is applied via animate
              >
                <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2 text-indigo-400"/>
                    Notes for {topics.find(t => t._id === selectedTopic)?.name || "Selected Topic"}
                </h2>
                <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 max-h-48 overflow-y-auto pr-2"
                     dangerouslySetInnerHTML={{ __html: topicNotes }}
                />
              </motion.div>
            )}
            </AnimatePresence>

            {/* Problems Grid */}
            {loadingProblems ? <LoadingState />
              : error ? <ErrorState message={error} title="Could not load problems"/>
              : problems.length === 0 ? <EmptyState message="No Problems Found" />
              : (
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6" // Responsive grid
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {problems.map((problem, index) => (
                    <motion.div key={problem._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      <ProblemCard problem={problem} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemListPage;
"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopic, getTopicProblems, getTopicNotes } from "../../service/topicService"; // Adjust path
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { FiArrowLeft, FiFileText, FiList, FiLoader, FiAlertCircle, FiInbox, FiCheckCircle, FiAlertTriangle, FiCircle, FiArrowRight } from "react-icons/fi";

// --- Reusable UI Components (Keep these as they are good) ---
const LoadingState = ({ text = "Loading Topic Details..." }) => (
  <div className="flex flex-col justify-center items-center h-64 text-slate-400 py-10">
    <FiLoader className="animate-spin h-10 w-10 text-indigo-400 mb-3" />
    <p className="text-sm">{text}</p>
  </div>
);

const ErrorState = ({ message, title = "Error Loading Data", showBackButton = true }) => (
  <div className="max-w-2xl mx-auto text-center py-12">
    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-5 rounded-lg shadow-md flex flex-col items-center space-y-3">
      <FiAlertCircle className="h-10 w-10 text-red-400 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-red-200 text-lg">{title}</h4>
        <p className="text-sm">{message}</p>
      </div>
      {showBackButton && (
        <Link
            to="/topics"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-100 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
        </Link>
      )}
    </div>
  </div>
);

const EmptyState = ({ icon: Icon = FiInbox, title, message, ctaLink, ctaText }) => (
  <div className="text-center py-12 px-6 bg-slate-800/50 rounded-xl shadow-sm my-6">
    <Icon className="mx-auto h-12 w-12 text-slate-500 mb-3" />
    <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
    {message && <p className="mt-1 text-xs text-slate-400">{message}</p>}
    {ctaLink && ctaText && (
      <div className="mt-6">
        <Link
          to={ctaLink}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-100 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
          {ctaText}
        </Link>
      </div>
    )}
  </div>
);

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
    } else if (problem.solved) {
        return <FiCheckCircle className="w-4 h-4 text-green-400" title="Solved" />;
    }
    return null;
  };
  return (
    <Link
      to={`/problems/${problem._id}`}
      className={`group block h-full relative transition-all duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-xl`}
      aria-label={`View problem: ${problem.title}`}
    >
      <div className={`h-full bg-slate-800 rounded-xl shadow-lg overflow-hidden border ${difficultyStyles.border} flex flex-col`}>
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 leading-tight">
              {problem.title}
            </h3>
            <div className="flex-shrink-0 ml-2">{getStatusIcon(problem.userStatus)}</div>
          </div>
          <div className="flex items-center mb-3">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${difficultyStyles.bgDot}`}></span>
            <span className={`text-xs font-medium ${difficultyStyles.text}`}>
              {problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : "N/A"}
            </span>
          </div>
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {problem.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700 text-slate-400">{tag}</span>
              ))}
              {problem.tags?.length > 2 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-600 text-slate-400">+{problem.tags.length - 2}</span>}
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

const TopicDetailPage = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      if (!id) {
        setError("Topic ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [topicData, problemsData, notesData] = await Promise.all([
          getTopic(id),
          getTopicProblems(id),
          getTopicNotes(id),
        ]);
        setTopic(topicData);
        setProblems(Array.isArray(problemsData) ? problemsData : []);
        setNotes(notesData);
      } catch (err) {
        setError("Failed to load topic details. Please try again later.");
        console.error("Error fetching topic details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicData();
  }, [id]);

  const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
  const pageTransition = { duration: 0.4 };

  if (loading) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center"><LoadingState /></div>;
  }
  if (error) {
    return <div className="bg-slate-900 min-h-screen pt-16 px-4"><ErrorState message={error} /></div>;
  }
  if (!topic) {
    return <div className="bg-slate-900 min-h-screen pt-16 px-4"><ErrorState title="Topic Not Found" message="The topic you're looking for doesn't exist or has been removed."/></div>;
  }

  const sanitizedNotesHtml = notes && notes.notes ? DOMPurify.sanitize(notes.notes) : null;

  return (
    <motion.div
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
      className="bg-slate-900 min-h-screen text-slate-200 px-4 sm:px-6 lg:px-8 py-10 md:py-12"
    >
      <div className="max-w-4xl mx-auto"> {/* Changed to max-w-4xl for a focused content column */}
        <div className="mb-8">
          <Link
            to="/topics"
            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <FiArrowLeft className="mr-2 h-4 w-4 transform transition-transform group-hover:-translate-x-0.5" />
            Back to Topics
          </Link>
        </div>

        {/* Topic Header */}
        <header className="mb-10 md:mb-12 pb-8 border-b border-slate-700/50">
          <div className="flex items-center mb-2">
            <div className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center bg-gradient-to-br ${
                ['from-indigo-500 to-purple-600', 'from-sky-500 to-cyan-500', 'from-emerald-500 to-green-600', 'from-amber-500 to-orange-600'][topic.name.charCodeAt(0) % 4]
            }`}>
                <FiList className="w-6 h-6 text-white"/>
            </div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
                    {topic.name}
                </h1>
                {topic.description && (
                    <p className="mt-1 text-md text-slate-400 max-w-2xl">{topic.description}</p>
                )}
            </div>
          </div>
        </header>

        {/* Notes Section - Now takes full width of the content column */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-12 md:mb-16" // Added more bottom margin
        >
          <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-5 flex items-center">
              <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-indigo-400"/>
              About {topic.name}
            </h2>
            {sanitizedNotesHtml ? (
              <div
                className="prose prose-base lg:prose-lg prose-invert max-w-none text-slate-300 leading-relaxed" // Increased prose size
                dangerouslySetInnerHTML={{ __html: sanitizedNotesHtml }}
              />
            ) : (
              <p className="text-sm text-slate-400 italic py-4">No detailed notes available for this topic yet.</p>
            )}
          </div>
        </motion.section>

        {/* Problems Section - Below notes, takes full width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 flex items-center">
                <FiList className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-indigo-400"/>
                Related Problems ({problems.length})
            </h2>
            {/* Optional: Link to suggest a problem or view all problems if filtered */}
          </div>

          {problems.length === 0 ? (
            <EmptyState
              icon={FiInbox}
              title="No Problems Yet"
              message={`There are no problems currently associated with the topic "${topic.name}". Check back later!`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {/* Adjusted grid for potentially fewer columns if notes take up more vertical space */}
              {problems.map((problem, index) => (
                <motion.div key={problem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProblemCard problem={problem} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default TopicDetailPage;
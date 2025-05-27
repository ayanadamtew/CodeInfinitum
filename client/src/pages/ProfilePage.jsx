"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path
import api from "../service/api"; // Adjust path
import { Link } from "react-router-dom"; // Import Link
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckSquare,
  FiZap,
  FiAward,
  FiLoader,
  FiAlertCircle,
  FiList,
  FiBarChart2,
} from "react-icons/fi";

// --- Reusable UI Components (Import or define as needed) ---
const LoadingState = ({ text = "Loading Profile..." }) => (
  <div className="flex flex-col justify-center items-center h-64 text-slate-400 py-10">
    <FiLoader className="animate-spin h-10 w-10 text-indigo-400 mb-3" />
    <p className="text-sm">{text}</p>
  </div>
);

const ErrorState = ({ message, title = "Error Loading Profile" }) => (
  <div className="max-w-2xl mx-auto text-center py-12">
    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-5 rounded-lg shadow-md flex flex-col items-center space-y-3">
      <FiAlertCircle className="h-10 w-10 text-red-400 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-red-200 text-lg">{title}</h4>
        <p className="text-sm">{message}</p>
      </div>
      {/* Optional: Add a retry button if feasible */}
    </div>
  </div>
);

const StatCard = ({
  value,
  label,
  icon: Icon,
  colorClass = "text-indigo-400",
}) => (
  <motion.div
    className="bg-slate-700/50 p-5 rounded-xl border border-slate-700 shadow-md text-center"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Icon className={`w-8 h-8 mx-auto mb-3 ${colorClass}`} />
    <div className={`text-3xl font-bold ${colorClass}`}>{value ?? "-"}</div>
    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
      {label}
    </div>
  </motion.div>
);

const DifficultyProgressBar = ({
  label,
  colorClass = "bg-slate-500",
  textColor = "text-slate-300",
  solved = 0,
  total = 0,
}) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
        <span className="text-xs text-slate-400">
          {solved} / {total}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`${colorClass} h-2 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

// --- Profile Page Component ---
const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    progress: null,
    solvedProblems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        // Don't fetch if user isn't loaded yet
        setLoading(false); // Or maybe show a specific "please log in" message
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const [progressResponse, solvedResponse] = await Promise.allSettled([
          api.get("/users/me/progress"),
          api.get("/users/me/solved-problems"),
        ]);

        let fetchedProgress = null;
        let fetchedSolved = [];
        let fetchError = null;

        if (progressResponse.status === "fulfilled") {
          fetchedProgress = progressResponse.value.data;
        } else {
          console.error("Error fetching progress:", progressResponse.reason);
          fetchError = "Could not load progress data.";
        }

        if (solvedResponse.status === "fulfilled") {
          fetchedSolved = Array.isArray(solvedResponse.value.data)
            ? solvedResponse.value.data.sort(
                (a, b) => new Date(b.solvedAt) - new Date(a.solvedAt)
              ) // Sort by most recent
            : [];
        } else {
          console.error(
            "Error fetching solved problems:",
            solvedResponse.reason
          );
          fetchError = fetchError
            ? "Could not load profile data."
            : "Could not load solved problems."; // Append or set error
        }

        setProfileData({
          progress: fetchedProgress,
          solvedProblems: fetchedSolved,
        });
        if (fetchError) setError(fetchError);
      } catch (err) {
        // Catch unexpected errors during Promise.all or setup
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // Re-fetch if user object changes (e.g., after login)

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };
  const pageTransition = { duration: 0.5 };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    // Provide a link back or retry mechanism if appropriate
    return (
      <div className="bg-slate-900 min-h-screen pt-16 px-4">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!user) {
    // Handle case where user data is still not available from context
    return (
      <div className="bg-slate-900 min-h-screen pt-16 px-4 text-center text-slate-400">
        Please log in to view your profile.
        <Link to="/login" className="text-indigo-400 hover:underline ml-2">
          Login
        </Link>
      </div>
    );
  }

  const { progress, solvedProblems } = profileData;

  // Safely calculate progress percentages
  const calculatePercentage = (solved, total) =>
    total > 0 ? (solved / total) * 100 : 0;
  const easyPercentage = calculatePercentage(
    progress?.easySolved,
    progress?.easyTotal
  );
  const mediumPercentage = calculatePercentage(
    progress?.mediumSolved,
    progress?.mediumTotal
  );
  const hardPercentage = calculatePercentage(
    progress?.hardSolved,
    progress?.hardTotal
  );

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-slate-900 min-h-screen text-slate-200 px-4 sm:px-6 lg:px-8 py-10 md:py-12"
    >
      <div className="max-w-5xl mx-auto">
        {" "}
        {/* Slightly narrower max-width */}
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-indigo-900/50 rounded-xl shadow-lg overflow-hidden mb-8 md:mb-10 border border-slate-700">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center">
              {/* Avatar */}
              <div className="flex-shrink-0 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-slate-700 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-300 text-3xl sm:text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              {/* User Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                  {user?.username || "Username"}
                </h1>
                <p className="text-sm text-indigo-400 mt-1 flex items-center justify-center sm:justify-start">
                  <FiMail className="w-4 h-4 mr-1.5" />{" "}
                  {user?.email || "No email"}
                </p>
                <p className="text-xs text-slate-400 mt-2 flex items-center justify-center sm:justify-start">
                  <FiCalendar className="w-3.5 h-3.5 mr-1.5" />
                  Member since{" "}
                  {user?.registrationDate
                    ? new Date(user.registrationDate).toLocaleDateString()
                    : "N/A"}
                </p>
                {/* Optional: Add Edit Profile Button */}
                {/* <button className="mt-3 text-xs ...">Edit Profile</button> */}
              </div>
            </div>
          </div>
        </div>
        {/* Progress Section */}
        {progress && (
          <motion.div
            className="mb-8 md:mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-slate-100 flex items-center">
              <FiBarChart2 className="w-6 h-6 mr-2 text-indigo-400" /> Your
              Progress
            </h2>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <StatCard
                value={progress.totalSolved}
                label="Problems Solved"
                icon={FiCheckSquare}
                colorClass="text-green-400"
              />
              <StatCard
                value={progress.streak}
                label="Current Streak"
                icon={FiZap}
                colorClass="text-yellow-400"
              />
              <StatCard
                value={progress.ranking}
                label="Global Rank"
                icon={FiAward}
                colorClass="text-sky-400"
              />
            </div>

            {/* Difficulty Breakdown */}
            <h3 className="text-lg font-medium mb-4 text-slate-200">
              Difficulty Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <DifficultyProgressBar
                label="Easy"
                colorClass="bg-green-500"
                textColor="text-green-400"
                solved={progress.easySolved}
                total={progress.easyTotal}
              />
              <DifficultyProgressBar
                label="Medium"
                colorClass="bg-yellow-500"
                textColor="text-yellow-400"
                solved={progress.mediumSolved}
                total={progress.mediumTotal}
              />
              <DifficultyProgressBar
                label="Hard"
                colorClass="bg-red-500"
                textColor="text-red-400"
                solved={progress.hardSolved}
                total={progress.hardTotal}
              />
            </div>
          </motion.div>
        )}
        {/* Recently Solved Problems Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-slate-100 flex items-center">
            <FiList className="w-6 h-6 mr-2 text-indigo-400" /> Recently Solved
          </h2>
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            {solvedProblems.length === 0 ? (
              <p className="p-6 text-center text-slate-400 text-sm italic">
                No problems solved yet.{" "}
                <Link
                  to="/problems"
                  className="text-indigo-400 hover:underline"
                >
                  Start practicing!
                </Link>
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        Problem
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        Difficulty
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        Solved On
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        Language
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {solvedProblems.slice(0, 10).map(
                      (
                        problem // Show maybe last 10 solved
                      ) => (
                        <tr
                          key={
                            problem.id || problem._id
                          } /* Use correct ID key */
                          className="hover:bg-slate-700/40 transition-colors duration-150 text-xs"
                        >
                          <td className="px-5 py-3 whitespace-nowrap font-medium">
                            {/* Use Link component for internal navigation */}
                            <Link
                              to={`/problems/${problem.id || problem._id}`}
                              className="text-indigo-400 hover:text-indigo-300 hover:underline"
                            >
                              {problem.title || "N/A"}
                            </Link>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            {/* Reusing the dark theme badge style */}
                            <span
                              className={`px-2 py-0.5 inline-flex text-[11px] leading-4 font-semibold rounded-full ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-300"
                                  : problem.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {problem.difficulty || "N/A"}
                            </span>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-slate-400">
                            {problem.solvedAt
                              ? new Date(problem.solvedAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                            {problem.language || "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

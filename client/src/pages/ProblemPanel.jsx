// components/ProblemPanel.js
"use client";

import React, { useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import {
  FiInfo,
  FiCheckCircle,
  FiCode,
  FiEye,
} from "react-icons/fi";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Editor from "@monaco-editor/react";
import UIComponents from "../components/UIComponents"; // Assuming this path

const { LoadingSpinner } = UIComponents;

const convertToHtml = (markdownText) => {
  if (!markdownText) return "";
  marked.setOptions({
    gfm: true,
    breaks: true,
    smartypants: true,
  });
  return marked.parse(markdownText);
};

// --- Sub-Components (ProblemHeader, TabButton, StatementContent, etc.) ---
// These remain unchanged from your original provided code.
// For brevity, I'll include them collapsed. Make sure they are present.
const ProblemHeader = ({ title, difficulty, tags }) => (
    <div className="p-5 border-b border-slate-700 flex-shrink-0">
      <h1 className="text-2xl font-bold text-slate-100">{title || "Problem"}</h1>
      <div className="flex flex-wrap items-center mt-3 gap-x-3 gap-y-1">
        {difficulty && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
              difficulty === "Easy"
                ? "bg-green-500/20 text-green-300"
                : difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {difficulty}
          </span>
        )}
        <div className="flex flex-wrap gap-1.5">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700 text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      role="tab"
      aria-selected={isActive}
      className={`relative flex items-center py-3 px-4 text-center border-b-2 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:z-10 transition-colors duration-150 ease-in-out ${
        isActive
          ? "border-indigo-500 text-indigo-300"
          : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const StatementContent = ({ problem }) => (
    <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-slate-300 prose-code:text-cyan-300 prose-strong:text-slate-100 prose-headings:text-slate-100">
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            problem?.statement || "<p>Problem statement not available.</p>"
          ),
        }}
      />
      {problem?.examples?.length > 0 && (
        <div className="mt-6 not-prose">
          <h3 className="text-lg font-semibold mb-3 text-slate-100">Examples</h3>
          {problem.examples.map((example, index) => (
            <div
              key={index}
              className="mt-3 p-4 bg-slate-700/50 rounded-md border border-slate-600/50 text-sm"
            >
              <div className="mb-2">
                <strong className="font-medium text-slate-300">Input:</strong>{" "}
                <code className="ml-2 bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono">
                  {example.input}
                </code>
              </div>
              <div className="mb-2">
                <strong className="font-medium text-slate-300">Output:</strong>{" "}
                <code className="ml-2 bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono">
                  {example.output}
                </code>
              </div>
              {example.explanation && (
                <div className="mt-2">
                  <strong className="font-medium text-slate-300">
                    Explanation:
                  </strong>{" "}
                  <p className="text-slate-400 mt-1 text-xs">
                    {example.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {problem?.constraints?.length > 0 && (
        <div className="mt-6 not-prose">
          <h3 className="text-lg font-semibold mb-3 text-slate-100">
            Constraints
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const SubmissionsContent = ({ submissions = [] }) => { // Added default prop
    const getStatusClass = (status = "") => {
      switch (status.toLowerCase()) {
        case "accepted":
          return "bg-green-500/20 text-green-300";
        case "wrong answer":
          return "bg-red-500/20 text-red-300";
        case "time limit exceeded":
          return "bg-yellow-500/20 text-yellow-300";
        case "memory limit exceeded":
          return "bg-orange-500/20 text-orange-300";
        case "runtime error":
          return "bg-purple-500/20 text-purple-300";
        case "compile error":
          return "bg-slate-600 text-slate-300";
        default:
          return "bg-sky-500/20 text-sky-300";
      }
    };
    return (
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          Your Submissions
        </h3>
        {submissions.length === 0 ? (
          <p className="text-slate-400 italic text-sm">
            You haven't made any submissions for this problem yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-slate-700 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  {["Status", "Language", "Runtime", "Memory", "Submitted"].map(
                    (header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {submissions.map((sub) => (
                  <tr
                    key={sub.id || sub._id}
                    className="hover:bg-slate-700/40 transition-colors duration-100 text-xs"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 inline-flex text-[11px] leading-4 font-semibold rounded-full ${getStatusClass(
                          sub.status
                        )}`}
                      >
                        {sub.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {sub.language || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {sub.executionTime != null
                        ? `${sub.executionTime} ms`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {sub.memoryUsage != null ? `${sub.memoryUsage} KB` : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                      {sub.submissionTime
                        ? new Date(sub.submissionTime).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const SolutionContent = ({ solution }) => (
    <div>
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Official Solution
      </h3>
      {solution ? (
        <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-slate-300 prose-code:text-cyan-300 prose-strong:text-slate-100 prose-headings:text-slate-100">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                solution.explanation || "<p>Explanation not available.</p>"
              ),
            }}
          />
          {solution.code && (
            <div className="mt-6 not-prose">
              <h4 className="text-base font-semibold text-slate-200 mb-2">
                Solution Code ({solution.language || "N/A"})
              </h4>
              <div className="border border-slate-700 rounded-md overflow-hidden min-h-[200px] max-h-[400px] resize-y">
                <Editor
                  height="100%" // Ensure Editor fills its container for resize to work
                  language={solution.language?.toLowerCase() || "plaintext"}
                  value={solution.code || ""}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    automaticLayout: true, // Important for responsive resizing
                    wordWrap: "on",
                    padding: { top: 10, bottom: 10 },
                  }}
                />
              </div>
            </div>
          )}
          {solution.complexity && (
            <div className="mt-6 not-prose">
              <h4 className="text-base font-semibold text-slate-200 mb-2">
                Complexity Analysis
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
                {solution.complexity.time && (
                  <li>
                    <strong>Time:</strong> {solution.complexity.time}
                  </li>
                )}
                {solution.complexity.space && (
                  <li>
                    <strong>Space:</strong> {solution.complexity.space}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-400 italic text-sm">
          The official solution is not yet available.
        </p>
      )}
    </div>
  );

  const VisualizationContent = ({ assetUrl }) => (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Algorithm Visualization
      </h3>
      {assetUrl ? (
        <div className="w-full max-w-xl rounded-lg shadow-lg overflow-hidden border border-slate-700">
          {assetUrl.endsWith(".mp4") ? (
            <video controls className="w-full h-auto block" src={assetUrl}>
              Your browser does not support the video tag.
            </video>
          ) : assetUrl.endsWith(".gif") ? (
            <img
              src={assetUrl}
              alt="Algorithm Visualization"
              className="w-full h-auto block"
            />
          ) : (
            <p className="text-slate-400 p-4 text-center text-sm">
              Unsupported visualization format.
            </p>
          )}
        </div>
      ) : (
        <p className="text-slate-400 italic text-sm">
          No visualization available for this problem.
        </p>
      )}
    </div>
  );
// --- End of Sub-Components ---


const ProblemPanel = ({
  problem,
  activeTab,
  setActiveTab,
  submissions,
  solution,
  tabContentLoading,
}) => {
  const TABS_DEFINITION = [
    {
      id: "statement",
      label: "Statement",
      icon: <FiInfo className="mr-1.5" />,
    },
    {
      id: "submissions",
      label: "Submissions",
      icon: <FiCheckCircle className="mr-1.5" />,
    },
    { id: "solution", label: "Solution", icon: <FiCode className="mr-1.5" /> },
  ];

  // Dynamically add visualize tab if assetUrl exists
  const TABS = React.useMemo(() => {
    const tabs = [...TABS_DEFINITION];
    if (problem?.visualizationAssetUrl) {
      tabs.push({
        id: "visualize",
        label: "Visualize",
        icon: <FiEye className="mr-1.5" />,
      });
    }
    return tabs;
  }, [problem?.visualizationAssetUrl]);


  // Effect to switch tab if current activeTab is removed (e.g. visualize tab disappears)
  useEffect(() => {
    if (!TABS.find(tab => tab.id === activeTab)) {
      setActiveTab("statement"); // Default to statement tab
    }
  }, [TABS, activeTab, setActiveTab]);


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden min-h-0"
    >
      <ProblemHeader
        title={problem?.title}
        difficulty={problem?.difficulty}
        tags={problem?.tags}
      />

      <nav className="border-b border-slate-700 flex-shrink-0">
        <div className="flex space-x-1 px-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={
                <span className="flex items-center text-xs sm:text-sm whitespace-nowrap">
                  {tab.icon}
                  {tab.label}
                </span>
              }
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-controls={`tabpanel-${tab.id}`}
            />
          ))}
        </div>
      </nav>

      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
          >
            {tabContentLoading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner text="Loading content..." />
              </div>
            ) : (
              <>
                {activeTab === "statement" && (
                  <StatementContent problem={problem} />
                )}
                {activeTab === "submissions" && (
                  <SubmissionsContent submissions={submissions} />
                )}
                {activeTab === "solution" && (
                  <SolutionContent solution={solution} />
                )}
                {activeTab === "visualize" && problem?.visualizationAssetUrl && (
                  <VisualizationContent
                    assetUrl={problem.visualizationAssetUrl}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProblemPanel;
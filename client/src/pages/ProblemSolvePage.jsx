"use client";

import { useState, useEffect, useCallback, useContext, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import api from "../service/api";
import { FiArrowLeft, FiMessageSquare } from "react-icons/fi";
import ProblemPanel from "./ProblemPanel";
import EditorPanel from "./EditorPanel";
import IntegratedAIChat from "./IntegratedAIChat";
import UIComponents from "../components/UIComponents";

import { useAuth } from "../context/AuthContext";

const { LoadingSpinner, ErrorMessage } = UIComponents;

// Helper for unique message IDs
const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const ProblemSolvePage = () => {
  const { id } = useParams(); // This `id` is from the URL, e.g., 'problem123'
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const aiInitializedRef = useRef(false);

  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState("statement");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submissions, setSubmissions] = useState([]);
  const [solution, setSolution] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [tabContentLoading, setTabContentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [solutionError, setSolutionError] = useState(null);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiChatVisible, setIsAiChatVisible] = useState(false); // Start as false, will be set true
  const [isAiChatMinimized, setIsAiChatMinimized] = useState(false);
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false); // Used for both summary and general AI queries

  const setInitialCodeForLanguage = useCallback((problemData, lang) => {
    if (problemData?.initialCode?.[lang]) {
      setCode(problemData.initialCode[lang]);
    } else {
      const templates = {
        javascript: `/**\n * @param {any} input - Describe the input parameter\n * @return {any} - Describe the expected return value\n */\nvar solve = function(input) {\n    // Your code here\n    return;\n};`,
        python: `class Solution:\n    def solve(self, input: any) -> any:\n        # Your code here\n        return`,
        java: `class Solution {\n    /**\n     * @param input - Describe the input parameter\n     * @return Describe the expected return value\n     */\n    public static ReturnType solve(InputType input) {\n        // Your code here\n        return;\n    }\n}`,
        cpp: `#include <vector>\n\nclass Solution {\npublic:\n    /**\n     * @param input Describe the input parameter\n     * @return Describe the expected return value\n     */\n    ReturnType solve(InputType input) {\n        // Your code here\n        return;\n    }\n};`,
      };
      setCode(templates[lang] || "// Select a language to see a template.");
    }
  }, []);

  // Effect to fetch problem data
  useEffect(() => {
    if (!id) {
      setError("Problem ID is missing.");
      setLoadingProblem(false);
      return;
    }

    const fetchProblemData = async () => {
      setLoadingProblem(true);
      setError(null);
      setProblem(null); // Clear previous problem
      setAiMessages([]); // Clear previous AI messages
      aiInitializedRef.current = false; // Reset AI init ref on new problem load
      setIsAiChatVisible(false); // Keep chat hidden until problem data is ready for greeting

      try {
        const response = await api.get(`/problems/${id}`);
        const fetchedProblem = response.data;
        setProblem(fetchedProblem); // This will trigger the AI greeting/summary useEffect
        setInitialCodeForLanguage(fetchedProblem, language);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(
          err.response?.data?.message || "Failed to load problem details."
        );
        setProblem(null); // Ensure problem is null on error
      } finally {
        setLoadingProblem(false);
      }
    };
    fetchProblemData();
  }, [id, language, setInitialCodeForLanguage]); // Language change re-fetches to reset code template

  // *******************************************************************
  // ** EPIC 1: Intro to Problems with AI Help - New/Modified useEffect **
  // *******************************************************************
  useEffect(() => {
    if (problem && problem.title && id && !aiInitializedRef.current) {
      aiInitializedRef.current = true;
      // Ensure problem is loaded and id is available
      // 1.1: Auto-open chat
      setIsAiChatVisible(true);
      setIsAiChatMinimized(false);

      // 1.2: Send greeting message
      const greetingContent = `Hi ${
        user?.username || "there"
      }! I'm here to help you with "${
        problem.title
      }". Let's get started! First, here's a quick summary of the problem:`;
      const greetingMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: greetingContent,
      };
      setAiMessages([greetingMessage]); // Initialize with greeting

      // 1.3: Fetch and display summary
      const fetchSummary = async () => {
        setIsLoadingAiResponse(true); // Use existing loading state for chat UI
        try {
          // Use `id` from useParams, which corresponds to the /:id in the route
          const summaryRes = await api.get(`/problems/${id}/generated-summary`);
          const summaryContent = summaryRes.data.summary; // Assuming { summary: "..." }
          const summaryMessage = {
            id: generateMessageId(),
            role: "assistant",
            content: summaryContent,
          };
          setAiMessages((prevMessages) => [...prevMessages, summaryMessage]);
        } catch (summaryError) {
          console.error("Failed to fetch problem summary:", summaryError);
          const errorSummaryMessage = {
            id: generateMessageId(),
            role: "assistant",
            content:
              "Sorry, I couldn't fetch the problem summary right now. Feel free to ask me any questions you have about the problem!",
          };
          setAiMessages((prevMessages) => [
            ...prevMessages,
            errorSummaryMessage,
          ]);
        } finally {
          setIsLoadingAiResponse(false);
        }
      };

      fetchSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, user, id]); // Depends on problem, user (for greeting), and id (for API call)
  // The `id` dependency ensures if the user navigates directly to a new problem page
  // without `problem` object changing first (e.g. from null to new problem), this still runs.

  const fetchSubmissions = useCallback(async () => {
    if (!id) return;
    setTabContentLoading(true);
    try {
      const response = await api.get(`/users/me/problems/${id}/submissions`);
      const sortedSubs = Array.isArray(response.data)
        ? response.data.sort(
            (a, b) => new Date(b.submissionTime) - new Date(a.submissionTime)
          )
        : [];
      setSubmissions(sortedSubs);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setTabContentLoading(false);
    }
  }, [id]);

  const fetchSolution = useCallback(async () => {
    if (!id) return;
    setTabContentLoading(true);
    setSolutionError(null);
    try {
      const response = await api.get(`/problems/${id}/solution`);
      setSolution(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        // Expected: user hasn't solved the problem yet
        setSolutionError("locked");
      } else {
        console.error("Error fetching solution:", err);
        setSolutionError("error");
      }
    } finally {
      setTabContentLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!problem) return; // Only run if problem is loaded
    if (activeTab === "submissions") fetchSubmissions();
    else if (activeTab === "solution") fetchSolution();
  }, [activeTab, problem, fetchSubmissions, fetchSolution]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    // setInitialCodeForLanguage will be called by the main problem fetch useEffect
    // due to `language` being in its dependency array.
  };

  const handleRun = async () => {
    if (!id || isRunning) return;
    setIsRunning(true);
    setRunOutput(null);
    try {
      const response = await api.post("/run", {
        problemId: id,
        language,
        code,
        customInput,
      });
      setRunOutput(response.data);
    } catch (err) {
      console.error("Error running code:", err);
      setRunOutput({
        error: err.response?.data?.message || "Failed to run code.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/submit", {
        problemId: id,
        language,
        code,
      });
      const submissionId = data.submissionId; // Ensure backend returns this
      let sub;
      const maxAttempts = 15;
      let attempts = 0;
      do {
        await new Promise((r) => setTimeout(r, 1000));
        const resp = await api.get(`/submit/${submissionId}`); // Endpoint to get submission status
        sub = resp.data;
        attempts++;
      } while (
        (sub.status === "Pending" || sub.status === "Running") &&
        attempts < maxAttempts
      );

      setSubmissions((current) => {
        const filtered = current.filter(
          (s) => (s._id || s.id) !== (sub._id || sub.id)
        );
        return [sub, ...filtered].sort(
          (a, b) => new Date(b.submissionTime) - new Date(a.submissionTime)
        );
      });
      setActiveTab("submissions");
    } catch (err) {
      console.error("Error submitting code:", err);
      setRunOutput({
        error:
          err.response?.data?.message ||
          "Failed to submit code. Please check your solution or try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiSubmitQuery = async (userQueryContent) => {
    if (!userQueryContent.trim() || !id || isLoadingAiResponse) return;
    const userMessage = {
      role: "user",
      content: userQueryContent,
      id: generateMessageId(),
    };
    setAiMessages((prevMessages) => [...prevMessages, userMessage]);
    setAiInput("");
    setIsLoadingAiResponse(true);
    try {
      const response = await api.post("/ai-help", {
        // Assuming endpoint for general AI help
        problemId: id,
        userQuery: userQueryContent,
        // Send a slice of history, excluding the last user message already added optimistically
        conversationHistory: aiMessages.filter(
          (msg) => msg.id !== userMessage.id
        ),
        currentCode: code,
      });
      const aiResponse = {
        role: "assistant",
        content: response.data.aiResponse || "No response from AI.",
        id: generateMessageId(),
      };
      setAiMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (err) {
      console.error("Error getting AI help:", err);
      const errorMessage = {
        role: "assistant",
        content:
          err.response?.data?.message ||
          "Sorry, an error occurred while contacting the AI assistant.",
        id: generateMessageId(),
      };
      setAiMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoadingAiResponse(false);
    }
  };

  const handleAiChatClose = () => setIsAiChatVisible(false);
  const handleAiChatToggleMinimize = () =>
    setIsAiChatMinimized((prev) => !prev);
  const handleReopenAiChat = () => {
    setIsAiChatVisible(true);
    setIsAiChatMinimized(false);
  };

  if (loadingProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <LoadingSpinner text="Loading Problem..." />
      </div>
    );
  }

  if (error && !problem) {
    // Show error if problem failed to load AND problem is still null
    return (
      <div className="min-h-screen px-4 pt-16 bg-slate-900">
        <div className="max-w-2xl mx-auto">
          <ErrorMessage message={error} />
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-indigo-100 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    // Fallback if problem is still null after loading (e.g. redirect from invalid ID)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
        <ErrorMessage message="Problem data could not be loaded or problem does not exist. Please try again or select another problem." />
        <button
          onClick={() => navigate(-1)} // Or navigate to problem list
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-indigo-100 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen px-4 sm:px-6 lg:px-8 py-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto h-[calc(100vh-4rem)]">
        <ProblemPanel
          problem={problem}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          submissions={submissions}
          solution={solution}
          tabContentLoading={tabContentLoading}
          solutionError={solutionError}
          selectedLanguage={language}
        />
        <EditorPanel
          language={language}
          code={code}
          setCode={setCode}
          customInput={customInput}
          setCustomInput={setCustomInput}
          runOutput={runOutput}
          isRunning={isRunning}
          handleLanguageChange={handleLanguageChange}
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      <IntegratedAIChat
        problem={problem}
        messages={aiMessages}
        input={aiInput}
        onInputChange={(e) => setAiInput(e.target.value)}
        onSubmit={handleAiSubmitQuery}
        isVisible={isAiChatVisible}
        onClose={handleAiChatClose}
        onToggleMinimize={handleAiChatToggleMinimize}
        isMinimized={isAiChatMinimized}
        isLoadingAiResponse={isLoadingAiResponse}
      />

      {!isAiChatVisible &&
        problem && ( // Show reopen button only if problem is loaded
          <button
            onClick={handleReopenAiChat}
            className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 z-[999]"
            aria-label="Open AI Assistant"
          >
            <FiMessageSquare className="h-6 w-6" />
          </button>
        )}
    </div>
  );
};

export default ProblemSolvePage;

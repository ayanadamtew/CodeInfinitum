"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import MonacoEditor from "@monaco-editor/react";
import api from "../../services/api";

// Component for managing test cases
const TestCaseManager = ({ testCases, setTestCases }) => {
  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", expectedOutput: "", isVisible: false },
    ]);
  };

  const removeTestCase = (index) => {
    const newTestCases = [...testCases];
    newTestCases.splice(index, 1);
    setTestCases(newTestCases);
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Test Cases</h3>
        <button
          type="button"
          onClick={addTestCase}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Test Case
        </button>
      </div>

      {testCases.length === 0 ? (
        <p className="text-gray-500">
          No test cases added yet. Click "Add Test Case" to create one.
        </p>
      ) : (
        <div className="space-y-6">
          {testCases.map((testCase, index) => (
            <div key={index} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Test Case #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input
                  </label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) =>
                      updateTestCase(index, "input", e.target.value)
                    }
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Output
                  </label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      updateTestCase(index, "expectedOutput", e.target.value)
                    }
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    id={`visible-${index}`}
                    type="checkbox"
                    checked={testCase.isVisible}
                    onChange={(e) =>
                      updateTestCase(index, "isVisible", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`visible-${index}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Visible to users (shown as example)
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProblemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [problem, setProblem] = useState({
    title: "",
    statement: "",
    difficulty: "Easy",
    topic: null,
    tags: [],
    examples: [],
    constraints: [],
    timeLimit: 1000,
    memoryLimit: 128000,
    initialCode: {
      javascript: "",
      python: "",
      java: "",
      cpp: "",
    },
    testCases: [],
    solution: {
      explanation: "",
      code: {
        javascript: "",
        python: "",
        java: "",
        cpp: "",
      },
      complexity: {
        time: "",
        space: "",
      },
    },
    visualizationAssetUrl: "",
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newConstraint, setNewConstraint] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState("javascript");
  const [activeSolutionTab, setActiveSolutionTab] = useState("javascript");
  const [testCases, setTestCases] = useState([]);
  const [visualizationFile, setVisualizationFile] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/topics");
        setAvailableTags(response.data.map((topic) => topic.name));
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();

    const fetchTopics = async () => {
      try {
        const response = await api.get("/topics");
        setAvailableTopics(response.data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };

    fetchTopics();

    if (isEditMode) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/problems/${id}`);
          setProblem(response.data);
          setTestCases(response.data.testCases || []);
          setError(null);
        } catch (err) {
          console.error("Error fetching problem:", err);
          setError("Failed to load problem. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchProblem();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblem({ ...problem, [name]: value });
  };

  const handleStatementChange = (content) => {
    setProblem({ ...problem, statement: content });
  };

  const handleSolutionExplanationChange = (content) => {
    setProblem({
      ...problem,
      solution: { ...problem.solution, explanation: content },
    });
  };

  const handleInitialCodeChange = (value) => {
    setProblem({
      ...problem,
      initialCode: {
        ...problem.initialCode,
        [activeCodeTab]: value,
      },
    });
  };

  const handleSolutionCodeChange = (value) => {
    setProblem({
      ...problem,
      solution: {
        ...problem.solution,
        code: {
          ...problem.solution.code,
          [activeSolutionTab]: value,
        },
      },
    });
  };

  const handleComplexityChange = (e) => {
    const { name, value } = e.target;
    setProblem({
      ...problem,
      solution: {
        ...problem.solution,
        complexity: {
          ...problem.solution.complexity,
          [name]: value,
        },
      },
    });
  };

  const addTag = () => {
    if (newTag && !problem.tags.includes(newTag)) {
      setProblem({ ...problem, tags: [...problem.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setProblem({
      ...problem,
      tags: problem.tags.filter((t) => t !== tag),
    });
  };

  const addConstraint = () => {
    if (newConstraint) {
      setProblem({
        ...problem,
        constraints: [...problem.constraints, newConstraint],
      });
      setNewConstraint("");
    }
  };

  const removeConstraint = (index) => {
    const newConstraints = [...problem.constraints];
    newConstraints.splice(index, 1);
    setProblem({ ...problem, constraints: newConstraints });
  };

  const handleVisualizationChange = (e) => {
    setVisualizationFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Prepare the problem data with test cases
      const problemData = {
        ...problem,
        testCases,
      };

      let response;
      if (isEditMode) {
        response = await api.put(`/problems/${id}`, problemData);
      } else {
        response = await api.post("/problems", problemData);
      }

      // If there's a visualization file, upload it
      if (visualizationFile) {
        const formData = new FormData();
        formData.append("visualization", visualizationFile);
        await api.post(
          `/problems/${response.data.id || id}/visualization`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      navigate("/problems");
    } catch (err) {
      console.error("Error saving problem:", err);
      setError(
        "Failed to save problem. Please check your inputs and try again."
      );
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Problem" : "Create New Problem"}
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={problem.title}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={problem.difficulty}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="topicId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <select
              id="topic" 
              name="topic" 
              value={problem.topic || ""} 
              onChange={handleInputChange} 
              required 
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">-- Select a Topic --</option>
              {availableTopics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  <span className="sr-only">Remove tag</span>
                  <svg
                    className="h-2 w-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                list="available-tags"
                placeholder="Add a tag..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
              />
              <datalist id="available-tags">
                {availableTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Statement
          </label>
          <Editor
            apiKey="rx8s1n4uhn4vdupvlnm85zk613zhdofco8qowo82unxgepdg"
            initialValue={problem.statement}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleStatementChange}
          />
        </div>

        {/* Constraints */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Constraints
          </label>
          <ul className="mb-2 space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-grow">• {constraint}</span>
                <button
                  type="button"
                  onClick={() => removeConstraint(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex">
            <input
              type="text"
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              placeholder="Add a constraint..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
            />
            <button
              type="button"
              onClick={addConstraint}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        {/* Time and Memory Limits */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="timeLimit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Limit (ms)
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={problem.timeLimit}
              onChange={handleInputChange}
              min="100"
              step="100"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="memoryLimit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Memory Limit (KB)
            </label>
            <input
              type="number"
              id="memoryLimit"
              name="memoryLimit"
              value={problem.memoryLimit}
              onChange={handleInputChange}
              min="1000"
              step="1000"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Initial Code Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Code Templates
          </label>
          <div className="border rounded-md overflow-hidden">
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveCodeTab("javascript")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCodeTab === "javascript"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                JavaScript
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("python")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCodeTab === "python"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Python
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("java")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCodeTab === "java"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Java
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("cpp")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCodeTab === "cpp"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                C++
              </button>
            </div>
            <div className="h-64">
              <MonacoEditor
                language={activeCodeTab === "cpp" ? "cpp" : activeCodeTab}
                value={problem.initialCode[activeCodeTab] || ""}
                onChange={handleInitialCodeChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <TestCaseManager testCases={testCases} setTestCases={setTestCases} />

        {/* Solution */}
        <div>
          <h3 className="text-lg font-medium mb-4">Solution</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation
            </label>
            <Editor
              apiKey="rx8s1n4uhn4vdupvlnm85zk613zhdofco8qowo82unxgepdg"
              initialValue={problem.solution.explanation}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={handleSolutionExplanationChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solution Code
            </label>
            <div className="border rounded-md overflow-hidden">
              <div className="flex border-b">
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("javascript")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSolutionTab === "javascript"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  JavaScript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("python")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSolutionTab === "python"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Python
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("java")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSolutionTab === "java"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Java
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("cpp")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSolutionTab === "cpp"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  C++
                </button>
              </div>
              <div className="h-64">
                <MonacoEditor
                  language={
                    activeSolutionTab === "cpp" ? "cpp" : activeSolutionTab
                  }
                  value={problem.solution.code[activeSolutionTab] || ""}
                  onChange={handleSolutionCodeChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time Complexity
              </label>
              <input
                type="text"
                id="time"
                name="time"
                value={problem.solution.complexity.time}
                onChange={handleComplexityChange}
                placeholder="e.g., O(n)"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="space"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Space Complexity
              </label>
              <input
                type="text"
                id="space"
                name="space"
                value={problem.solution.complexity.space}
                onChange={handleComplexityChange}
                placeholder="e.g., O(n)"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Visualization Asset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visualization Asset
          </label>
          {problem.visualizationAssetUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-1">
                Current visualization:
              </p>
              {problem.visualizationAssetUrl.endsWith(".mp4") ? (
                <video
                  controls
                  className="max-w-md h-auto rounded"
                  src={problem.visualizationAssetUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : problem.visualizationAssetUrl.endsWith(".gif") ? (
                <img
                  src={problem.visualizationAssetUrl || "/placeholder.svg"}
                  alt="Visualization"
                  className="max-w-md h-auto rounded"
                />
              ) : (
                <a
                  href={problem.visualizationAssetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View current visualization
                </a>
              )}
            </div>
          )}
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="visualization-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="visualization-upload"
                    name="visualization-upload"
                    type="file"
                    className="sr-only"
                    accept="image/gif,image/png,image/jpeg,video/mp4"
                    onChange={handleVisualizationChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4 up to 10MB
              </p>
              {visualizationFile && (
                <p className="text-sm text-green-600">
                  Selected file: {visualizationFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/problems")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Problem"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProblemFormPage;

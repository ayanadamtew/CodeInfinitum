import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { FiPlayCircle, FiCheckCircle, FiSend } from "react-icons/fi";

const EditorPanel = ({
  language,
  code,
  setCode,
  customInput,
  setCustomInput,
  runOutput,
  isRunning,
  handleLanguageChange,
  handleRun,
  handleSubmit,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 min-h-0"
    >
      <div className="bg-slate-800 rounded-xl shadow-lg p-3 flex items-center justify-between">
        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium text-slate-300">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg flex-grow flex flex-col overflow-hidden">
        <div className="h-[60%] border-b border-slate-700">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              padding: { top: 15, bottom: 15 },
              mouseWheelZoom: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>
        
        <div className="h-[40%] flex flex-col">
          <div className="flex-shrink-0 p-2 bg-slate-800 border-b border-slate-700">
            <span className="font-medium text-sm text-slate-300">Console</span>
          </div>
          <div className="flex-grow flex flex-col overflow-hidden min-h-0">
            {/* <div className="h-1/2 flex flex-col border-b border-slate-700">
              <label className="px-2 py-1 text-xs font-medium text-slate-400 bg-slate-700/50">Input:</label>
              <textarea
                className="flex-grow p-2 resize-none focus:outline-none text-sm font-mono w-full bg-slate-900 text-slate-200 placeholder-slate-500 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom input for 'Run'..."
              />
            </div> */}
            <div className="h-1/2 flex flex-col">
              <div className="px-1 py-0.5 text-xs font-medium text-slate-400 bg-slate-700/50">Output:</div>
              <div className="flex-grow p-7 text-sm overflow-auto bg-slate-900 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {isRunning && !runOutput && (
                  <span className="text-slate-500 italic">Running...</span>
                )}
                {runOutput && (
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                    {runOutput.error ? (
                      <span className="text-red-400">{runOutput.error}</span>
                    ) : (
                      <span className="text-slate-200">{runOutput.output}</span>
                    )}
                    {(runOutput.time || runOutput.memory) && !runOutput.error && (
                      <div className="text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-700/50">
                        Runtime: {runOutput.time ?? "N/A"} ms | Memory: {runOutput.memory ?? "N/A"} KB
                      </div>
                    )}
                  </pre>
                )}
                {!isRunning && !runOutput && (
                  <span className="text-slate-500 italic text-xs">Run code to see output.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg p-3 flex justify-end space-x-3">
        <button
          onClick={handleRun}
          disabled={isRunning || isSubmitting}
          className="px-4 py-1 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 transition-colors duration-150 flex items-center"
        >
          <FiPlayCircle className="mr-1.5 w-4 h-4" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isRunning}
          className="px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 transition-colors duration-150 flex items-center"
        >
          <FiCheckCircle className="mr-1.5 w-4 h-4" />
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </motion.div>
  );
};

export default EditorPanel;
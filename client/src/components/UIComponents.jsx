import { FiLoader, FiXCircle } from "react-icons/fi";

export const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center h-full py-10 text-slate-400">
    <FiLoader className="animate-spin h-8 w-8 text-indigo-400 mb-3" />
    <p className="text-xs">{text}</p>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg shadow flex items-start space-x-2">
    <FiXCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
    <p className="text-sm">{message || "An unexpected error occurred."}</p>
  </div>
);

const UIComponents = {
  LoadingSpinner,
  ErrorMessage
};

export default UIComponents;
// components/IntegratedAIChat.js
"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiChevronDown, FiChevronsUp } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const convertToHtml = (markdownText) => {
  if (!markdownText) return "";
  marked.setOptions({
    gfm: true,
    breaks: true,
    smartypants: true,
  });
  return marked.parse(markdownText);
};

const IntegratedAIChat = ({
  problem,
  messages,
  input,
  onInputChange,
  onSubmit,
  isVisible,
  onClose,
  onToggleMinimize,
  isMinimized,
  isLoadingAiResponse,
}) => {
  const chatLogRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isMinimized && isVisible && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isMinimized, isVisible]);


  if (!isVisible) {
    return null;
  }

  if (isMinimized) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-[1000]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <button
          onClick={onToggleMinimize}
          aria-label="Open AI Assistant"
          className="bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center"
        >
          <FiMessageSquare className="h-6 w-6" />
          {problem?.title && <span className="ml-2 text-sm font-medium hidden sm:inline">AI: {problem.title.substring(0,15)}{problem.title.length > 15 ? '...' : ''}</span>}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      // --- UPDATED STYLING FOR SIZING AND OVERFLOW ---
      className="fixed bottom-0 right-0 md:bottom-4 md:right-4 
                 w-[calc(100%-1rem)] max-w-sm sm:max-w-md md:max-w-lg /* Max width, with small screen margin */
                 h-[75vh] md:h-[70vh] max-h-[600px] /* Responsive height */
                 bg-slate-800/80 backdrop-blur-md shadow-2xl 
                 rounded-t-xl md:rounded-xl flex flex-col z-[1000] 
                 border border-slate-700/70 overflow-hidden /* CRITICAL: Prevents content from visually overflowing the box */"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/60 rounded-t-xl md:rounded-t-xl flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="flex items-center min-w-0"> {/* Added min-w-0 for better truncation */}
          <FiMessageSquare className="mr-2 text-indigo-400 h-5 w-5 flex-shrink-0" /> {/* flex-shrink-0 for icon */}
          <h3 className="text-sm font-semibold text-slate-100 truncate">
            AI Assistant {problem?.title ? `- ${problem.title}` : ''}
          </h3>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2"> {/* Adjusted spacing */}
          <button
            onClick={onToggleMinimize}
            aria-label="Minimize AI Assistant"
            className="text-slate-400 hover:text-slate-200 focus:outline-none p-1.5 rounded hover:bg-slate-700" // Increased padding
          >
            {isMinimized ? <FiChevronsUp className="h-4 w-4" /> : <FiChevronDown className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose} // This calls handleAiChatClose which sets isAiChatVisible = false
            aria-label="Close AI Assistant"
            className="text-slate-400 hover:text-slate-200 focus:outline-none p-1.5 rounded hover:bg-slate-700" // Increased padding
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Log */}
      <div
        ref={chatLogRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm shadow-md break-words /* Added break-words */ ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 border border-slate-600/50 rounded-bl-none'
              }`}
            >
              <div
                className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-code:text-cyan-300 prose-pre:bg-slate-800/70 prose-pre:p-2.5 prose-pre:rounded-md prose-ul:my-2 prose-li:my-0.5"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(convertToHtml(msg.content)) }}
              />
            </div>
          </div>
        ))}
        {isLoadingAiResponse && (
            <div className="flex justify-start">
                 <div className="max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm shadow-md bg-slate-700 text-slate-200 border border-slate-600/50 rounded-bl-none">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.075s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.15s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </div>
                 </div>
            </div>
        )}
        {messages.length === 0 && !isLoadingAiResponse && problem && ( // Ensure problem is loaded for initial message
             <div className="text-center text-slate-500 py-8 px-4">
             {/* This will be quickly replaced by the initial greeting from ProblemSolvePage */}
            <p className="text-sm">AI Assistant is ready.</p>
            <p className="text-xs mt-1">Ask for hints, explanations, or debugging help.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() && !isLoadingAiResponse) onSubmit(input);
        }}
        className="p-3 border-t border-slate-700 flex items-center bg-slate-800/60 rounded-b-xl md:rounded-b-xl flex-shrink-0" // Added flex-shrink-0
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-grow border border-slate-600 bg-slate-700 rounded-l-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-400"
          placeholder="Ask the AI..."
          value={input}
          onChange={onInputChange}
          disabled={isLoadingAiResponse}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!input.trim() || isLoadingAiResponse}
          className="bg-indigo-600 text-white px-4 h-[44px] flex items-center justify-center rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </form>
    </motion.div>
  );
};

export default IntegratedAIChat;
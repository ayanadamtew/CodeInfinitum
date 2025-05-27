"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiZap,
  FiLayers,
  FiArrowRight,
  FiHash,
  FiList,
  FiEye,
  FiGitMerge,
  FiLoader,
  FiCode,
  FiTerminal,
  FiGlobe,
  FiEdit2,
  FiCalendar,
  FiSend,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";

// --- Feature Card Component ---
const FeatureCard = ({ icon: Icon, title, children }) => (
  <motion.div
    className="group bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50 
               transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:border-indigo-500/50"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <div
      className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-5 border border-indigo-700/50 
                 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
    >
      <Icon className="h-6 w-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-slate-100 transition-colors duration-200 group-hover:text-indigo-300">
      {title}
    </h3>
    <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
  </motion.div>
);

// --- Topic Pill Component ---
const TopicPill = ({ topic }) => (
  <motion.div
    className="group w-full h-24 cursor-pointer [perspective:1000px]"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-lg shadow-md bg-slate-700 border border-slate-600 flex flex-col items-center justify-center p-3 text-center">
        <FiHash className="w-5 h-5 text-indigo-400 mb-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-sm sm:text-base font-medium text-slate-200 leading-tight line-clamp-2">
          {topic}
        </h3>
      </div>
      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-500 flex flex-col items-center justify-center p-3 text-center">
        <span className="text-xs font-medium text-indigo-100 mb-1">
          View Problems
        </span>
        <FiArrowRight className="w-6 h-6 text-indigo-200" />
      </div>
    </div>
  </motion.div>
);

// --- Stacking Hero Cards Component ---
const StackingHeroCards = () => {
  const heroStackCardData = [
    {
      id: "example-problem-two-sum",
      type: "codeProblem",
      headerTitle: "Popular Problem",
      problemTitle: "Two Sum",
      language: "python",
      codeSnippet: `def two_sum(nums, target):\n  # Find two numbers that add up to target\n  lookup = {}\n  for i, num in enumerate(nums):\n    complement = target - num\n    if complement in lookup:\n      return [lookup[complement], i]\n    lookup[num] = i\n  return None`,
      ctaText: "Try This Problem",
      ctaLink: "/problems/two-sum",
    },
    {
      id: "feature-ai-assist",
      type: "featureHighlight",
      headerTitle: "LeetCoder Features",
      icon: FiCpu,
      featureName: "AI-Powered Assistance",
      description:
        "Stuck on a tricky part? Get intelligent hints and step-by-step guidance from our AI assistant, tailored to your current code and approach.",
      ctaText: "Learn About AI Help",
      ctaLink: "#features-section",
    },
    {
      id: "feature-visualizations",
      type: "featureHighlight",
      headerTitle: "LeetCoder Features",
      icon: FiEye,
      featureName: "Algorithm Visualizations",
      description:
        "Deepen your understanding of complex algorithms by watching them execute. See data structures change and logic unfold interactively.",
      ctaText: "See Visualizations",
      ctaLink: "#features-section",
    },
    {
      id: "explore-topics",
      type: "callToAction",
      headerTitle: "Master Concepts",
      icon: FiList,
      mainText: "Explore Diverse Topics",
      subText:
        "From Arrays and Strings to Graphs and Dynamic Programming. Build a strong foundation.",
      ctaText: "Browse All Topics",
      ctaLink: "/topics",
    },
  ];

  const [cards, setCards] = useState(heroStackCardData);

  const handleCardClick = (clickedIndex) => {
    if (clickedIndex === 0) return;

    setCards((prevCards) => {
      const newCards = [...prevCards];
      const [clickedCard] = newCards.splice(clickedIndex, 1);
      return [clickedCard, ...newCards];
    });
  };

  const getCardStyle = (indexInStack) => {
    const scale = Math.max(1 - indexInStack * 0.03, 0.9); // More subtle scaling
    const translateY = indexInStack * 10; // Less vertical spread
    const translateX =
      indexInStack % 2 === 0 ? indexInStack * -5 : indexInStack * 5; // Slight horizontal stagger
    const opacity =
      indexInStack > 2 ? 0 : Math.max(1 - indexInStack * 0.2, 0.5); // Keep cards more visible
    const zIndex = cards.length - indexInStack;
    const rotate = indexInStack * 15; // Slight rotational effect

    return {
      scale,
      y: translateY,
      x: translateX,
      opacity,
      zIndex,
      rotateZ: `${rotate}deg`,
      filter: indexInStack > 0 ? "blur(0.8px)" : "none",
      boxShadow:
        indexInStack === 0
          ? "0 10px 25px -5px rgba(56, 189, 248, 0.2)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };
  };

  const CardWindowHeader = ({ title }) => (
    <div className="p-1.5 sm:p-2 flex items-center space-x-1.5 border-b border-slate-700/40 flex-shrink-0 bg-slate-800/50">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
      <span className="text-[10px] text-slate-400 ml-2 truncate">
        {title || "LeetCoder"}
      </span>
    </div>
  );

  const SimpleCodeHighlighter = ({ code = "", lang }) => {
    let highlighted = code;
    if (lang === "python") {
      highlighted = code
        .replace(/^(def|class|for|in|if|return|None|#.*$)/gm, (match) => {
          if (match.startsWith("#"))
            return `<span class="text-slate-500">${match}</span>`;
          if (["def", "class", "for", "in", "if", "return"].includes(match))
            return `<span class="text-sky-400">${match}</span>`;
          if (match === "None")
            return `<span class="text-purple-400">${match}</span>`;
          return match;
        })
        .replace(/(\b\w+\b)(?=\()/g, '<span class="text-green-300">$1</span>');
    }
    return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="relative w-full max-w-lg h-[24rem] sm:h-[28rem] mx-auto [perspective:1200px]">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          layoutId={card.id}
          className={`absolute w-[92%] h-[92%] cursor-pointer rounded-lg
               bg-slate-800 border border-slate-700 overflow-hidden
               flex flex-col will-change-transform
               ${index === 0 ? "ring-1 ring-cyan-400/30" : ""}`}
          initial={false}
          animate={getCardStyle(index)}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 25,
            mass: 0.8,
          }}
          onClick={() => handleCardClick(index)}
          style={{ transformOrigin: "center" }}
        >
          {/* Universal Header - changes based on card type */}
          {card.type === "terminal" ? (
            <div className="px-3 py-2 flex items-center border-b border-slate-700 bg-slate-800">
              <div className="flex space-x-1.5 mr-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/90"></span>
              </div>
              <div className="flex space-x-3 text-xs text-slate-400">
                {card.tabs?.map((tab) => (
                  <span
                    key={tab}
                    className={`pb-0.5 ${
                      tab === card.activeTab
                        ? "text-slate-200 border-b border-cyan-400"
                        : ""
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <CardWindowHeader title={card.headerTitle} />
          )}

          {/* Card Content Area */}
          <div
            className={`p-4 flex-grow overflow-y-auto ${
              card.type === "terminal"
                ? "bg-slate-900/70 font-mono text-sm"
                : ""
            }`}
          >
            {card.type === "terminal" && (
              <div className="h-full flex flex-col">
                <div className="space-y-1 text-slate-300">
                  {card.commands?.map((cmd, i) => (
                    <div
                      key={i}
                      className={cmd.startsWith(">") ? "text-cyan-400" : ""}
                    >
                      {cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.type === "codeProblem" && (
              <>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">
                  {card.problemTitle}
                </h3>
                <pre className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-slate-900/60 p-3 rounded-md border border-slate-700/50">
                  <SimpleCodeHighlighter
                    code={card.codeSnippet}
                    lang={card.language}
                  />
                </pre>
              </>
            )}

            {card.type === "featureHighlight" && (
              <div className="flex flex-col items-start justify-center h-full text-left pt-2">
                {card.icon && (
                  <card.icon className="w-8 h-8 text-indigo-400 mb-3" />
                )}
                <h3 className="text-base font-semibold text-slate-100 mb-1.5">
                  {card.featureName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            )}

            {card.type === "callToAction" && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {card.icon && (
                  <card.icon className="w-10 h-10 text-indigo-400 mb-3" />
                )}
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {card.mainText}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {card.subText}
                </p>
              </div>
            )}
          </div>

          {/* Footer - different style for terminal cards */}
          <div className="flex-shrink-0 mt-auto border-t border-slate-700/50">
            {card.type === "terminal" ? (
              <div className="flex justify-between items-center px-3 py-2 bg-slate-800/50 text-xs">
                <span className="text-slate-500">Type 'help' for commands</span>
                <Link
                  to={card.ctaLink || "#"}
                  className="text-slate-300 hover:text-white flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {card.ctaText}
                  <FiArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            ) : (
              <Link
                to={card.ctaLink || "#"}
                className="block bg-slate-700/80 hover:bg-slate-600/80 p-3 text-sm flex justify-between items-center transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-slate-200 font-medium">
                  {card.ctaText || "Learn More"}
                </span>
                <FiArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Main HomePage Component ---
const HomePage = () => {
  const { user } = useAuth();

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen">
      {/* --- Hero Section --- */}
      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden isolate">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className="absolute w-96 h-96 bg-gradient-to-br from-indigo-500/30 via-purple-500/10 to-transparent rounded-full filter blur-3xl opacity-30 animate-[float-1_15s_ease-in-out_infinite]"
            style={{ top: "10%", left: "5%" }}
          ></div>
          <div
            className="absolute w-80 h-80 bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-transparent rounded-full filter blur-3xl opacity-20 animate-[float-2_20s_ease-in-out_infinite]"
            style={{ top: "50%", left: "60%" }}
          ></div>
          <div
            className="absolute w-72 h-72 bg-gradient-to-br from-pink-500/20 via-red-500/5 to-transparent rounded-full filter blur-3xl opacity-10 animate-[float-3_25s_ease-in-out_infinite]"
            style={{ top: "30%", left: "30%" }}
          ></div>
        </div>

        <motion.div
          className="container mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between text-center lg:text-left px-6 md:px-10 lg:px-16 py-20 lg:py-12 flex-grow"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-full lg:w-1/2 mb-16 lg:mb-0 flex justify-center lg:justify-start items-center"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <StackingHeroCards />
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex flex-col items-center lg:items-start"
            variants={itemVariants}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-indigo-300 text-center lg:text-left"
              variants={itemVariants}
            >
              Master Algorithms, <br className="hidden sm:block" /> Ace
              Interviews.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-slate-400 mb-10 max-w-xl text-center lg:text-left"
              variants={itemVariants}
            >
              Sharpen your skills with curated coding problems, AI-driven hints,
              and clear algorithm visualizations. Prepare effectively, land your
              dream job.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full max-w-md lg:max-w-none"
              variants={itemVariants}
            >
              <Link
                to="/problems"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 shadow-lg transform transition hover:scale-105"
              >
                Start Practicing Now
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-lg text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 shadow-lg transform transition hover:scale-105"
                >
                  Sign Up Free
                </Link>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Features Section --- */}
      <motion.div
        className="py-16 md:py-24"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-100"
              variants={itemVariants}
            >
              Why Choose LeetCoder?
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Everything you need to prepare effectively and land your dream
              tech role.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={FiLayers} title="Curated Problem Set">
              Practice with hundreds of problems spanning core data structures,
              algorithms, and common interview patterns.
            </FeatureCard>
            <FeatureCard icon={FiCpu} title="AI-Powered Assistance">
              Get unstuck with intelligent hints and explanations generated by
              our AI assistant, tailored to your code.
            </FeatureCard>
            <FeatureCard icon={FiZap} title="Algorithm Visualizations">
              Deepen your understanding by watching algorithms execute
              step-by-step with interactive visualizations.
            </FeatureCard>
          </div>
        </div>
      </motion.div>

      {/* --- Topics Section --- */}
      <motion.div
        className="bg-slate-800 py-16 md:py-24"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-100"
              variants={itemVariants}
            >
              Popular Topics
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-slate-400"
              variants={itemVariants}
            >
              Master these essential coding concepts.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Arrays",
              "Hashing",
              "Two Pointers",
              "Sliding Window",
              "Linked Lists",
              "Trees",
              "Graphs",
              "Dynamic Programming",
            ].map((topic) => (
              <Link
                key={topic}
                to={`/topics/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                aria-label={`View ${topic} problems`}
              >
                <TopicPill topic={topic} />
              </Link>
            ))}
          </div>
          <motion.div className="text-center mt-12" variants={itemVariants}>
            <Link
              to="/topics"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 shadow-md"
            >
              Explore All Topics <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* --- Final CTA Section --- */}
      <motion.div
        className="bg-indigo-700 text-indigo-100 py-16 md:py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            variants={itemVariants}
          >
            Ready to Elevate Your Coding Skills?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join thousands of developers mastering interviews with LeetCoder's
            targeted practice and tools.
          </motion.p>
          <motion.div variants={itemVariants}>
            {!user ? (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white shadow-lg transform transition hover:scale-105"
              >
                Sign Up for Free
              </Link>
            ) : (
              <Link
                to="/problems"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white shadow-lg transform transition hover:scale-105"
              >
                Continue Practicing
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;

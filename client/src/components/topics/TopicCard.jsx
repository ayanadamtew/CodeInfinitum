import { Link } from "react-router-dom";
import { FiTag, FiArrowRight, FiLayers } from "react-icons/fi"; // Example icons

const TopicCard = ({ topic }) => {
  // A simple hashing function to generate a somewhat unique gradient for each topic name
  // This is just for visual flair, can be removed or replaced with actual image/icon logic
  const getGradientForTopic = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 60) % 360; // Ensure a different hue for the second color
    return `bg-gradient-to-br from-hue-rotate-[${hue1}deg] via-hue-rotate-[${(hue1 + 30) % 360}deg] to-hue-rotate-[${hue2}deg] from-indigo-500 via-purple-500 to-pink-500`;
  };

  // Or use a predefined set of gradients
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-sky-500 via-cyan-500 to-teal-500",
    "from-green-500 via-lime-500 to-yellow-500",
    "from-orange-500 via-red-500 to-rose-500",
    "from-violet-500 via-fuchsia-500 to-rose-500",
  ];
  const gradientClass = gradients[Math.abs(topic.name.charCodeAt(0) % gradients.length)];


  return (
    <Link
      to={`/topics/${topic._id}`} // Assuming topic._id is the identifier
      className="group block h-full relative"
      aria-label={`View problems related to ${topic.name}`}
    >
      <div
        className={`
          h-full rounded-xl shadow-lg overflow-hidden 
          bg-slate-800 border border-slate-700 
          transition-all duration-300 ease-in-out
          hover:shadow-2xl hover:border-indigo-500/70 hover:scale-[1.02]
        `}
      >
        {/* Optional: Decorative top bar with gradient */}
        <div className={`h-2 ${gradientClass} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>

        <div className="p-6 flex flex-col justify-between h-[calc(100%-0.5rem)]"> {/* Adjust height if top bar is removed */}
          <div>
            <div className="flex items-center mb-3">
              <FiLayers className="w-7 h-7 text-indigo-400 mr-3 flex-shrink-0" /> {/* Icon for Topic */}
              <h3 className="text-xl font-semibold text-slate-100 truncate" title={topic.name}>
                {topic.name}
              </h3>
            </div>
            {topic.description && (
              <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2">
                {topic.description}
              </p>
            )}
          </div>

          <div className="mt-auto">
            {topic.problemCount > 0 && (
              <div className="flex items-center text-xs font-medium text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-md w-fit mb-4">
                <FiTag className="w-3.5 h-3.5 mr-1.5" />
                {topic.problemCount} {topic.problemCount === 1 ? "Problem" : "Problems"}
              </div>
            )}

            <div className="flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200">
              View Problems
              <FiArrowRight
                className="ml-1.5 w-4 h-4 transition-transform duration-300 ease-out 
                           transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;

// --- How to use in a grid (Example) ---
// const TopicListPage = () => {
//   const topics = [
//     { _id: "1", name: "Dynamic Programming", problemCount: 25, description: "Solve complex problems by breaking them down into simpler subproblems." },
//     { _id: "2", name: "Arrays & Hashing", problemCount: 42, description: "Master fundamental data structures and their applications in hashing." },
//     { _id: "3", name: "Graphs", problemCount: 18, description: "Explore graph theory, traversals, and algorithms like DFS and BFS." },
//     { _id: "4", name: "Two Pointers", problemCount: 30, description: "Efficiently solve array and string problems using the two-pointer technique." },
//     // ... more topics
//   ];

//   return (
//     <div className="bg-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-slate-100 mb-12">
//           Explore Topics
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
//           {topics.map(topic => (
//             <TopicCard key={topic._id} topic={topic} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
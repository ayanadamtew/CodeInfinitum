// client/src/pages/AboutPage.js
"use client";

import React from "react";
import { FiInfo, FiUsers, FiAward, FiCode, FiGithub ,FiTwitter,FiLinkedin,  FiInstagram  } from "react-icons/fi";
import { Link } from "react-router-dom"; // Assuming you use React Router for navigation

const AboutPage = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <FiInfo className="mx-auto text-indigo-400 h-16 w-16 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
            About Us
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Learn more about our mission, our team, and what drives us to build
            this platform.
          </p>
        </header>

        <section className="mb-12 p-6 bg-slate-800 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4 flex items-center">
            <FiAward className="mr-3 h-6 w-6" /> Our Mission
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Our primary mission is to provide an accessible, engaging, and
            effective platform for individuals to learn and master coding
            skills. We believe that anyone, anywhere, can learn to code with the
            right tools and support. We aim to bridge the gap between
            theoretical knowledge and practical application through interactive
            problem-solving, real-time feedback, and AI-powered assistance.
          </p>
        </section>

        <section className="mb-12 p-6 bg-slate-800 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4 flex items-center">
            <FiCode className="mr-3 h-6 w-6" /> What We Offer
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300 leading-relaxed">
            <li>
              A diverse collection of coding problems spanning various
              difficulty levels and topics.
            </li>
            <li>
              An intuitive in-browser code editor with support for multiple
              programming languages.
            </li>
            <li>
              Instant feedback on code submissions with detailed test case
              results.
            </li>
            <li>
              AI-powered chat assistant to provide hints, explanations, and
              debugging help.
            </li>
            <li>
              Personalized learning paths and progress tracking (Coming Soon!).
            </li>
            <li>
              A community forum for discussion and peer-to-peer learning (Coming
              Soon!).
            </li>
          </ul>
        </section>

        <section className="mb-12 p-6 bg-slate-800 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4 flex items-center">
            <FiUsers className="mr-3 h-6 w-6" /> Our Team
          </h2>
          <p className="text-slate-300 leading-relaxed">
            We are a passionate team of developers, educators, and AI
            enthusiasts dedicated to creating the best possible learning
            experience. Our diverse backgrounds and expertise allow us to
            approach coding education from multiple perspectives, ensuring a
            well-rounded and comprehensive platform.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Team Member 1 - Ayana */}
            <div className="bg-slate-700 p-5 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-white mb-1">
                Ayana Damtew
              </h3>
              <p className="text-indigo-300 font-medium mb-2">
                Co-founder and CTO
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Hi, I’m Ayana Damtew — co-founder of CodeInfinitum. I started building products from scratch with my teammate Naol Gezahegne in a small student dorm turned startup hub. I believe technology should be fast, reliable, and human-centered — crafted with care, not just code. Outside of shipping features and solving problems, I spend time exploring AI, refining my math skills, and dreaming up tools that make learning and working more meaningful.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/ayanadamtew"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FiGithub className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
                <a
                  href="https://x.com/ayuda0117"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FiTwitter className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/ayanadamtew"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/a_yu.da"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FiInstagram className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Team Member 2 - Placeholder */}
            <div className="bg-slate-700 p-5 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-white mb-1">
                Naol Gezahegne
              </h3>
              <p className="text-indigo-300 font-medium mb-2">Co-founder and CEO</p>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
               Hi, I’m Naol Gezahegne co-founder of CodeInfinitum. At 21, a founder with a deep passion for technology, collaborating with Ayana Damtew in my parents’ garage to hand-build the CodeInfinitum. I’m driven by a simple belief: computers should be powerful yet effortless to use, and beautiful in both form and function. When I’m not building startups or coding, I’m diving into books, exploring design, and imagining the next breakthrough in personal computing and AI.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/naol7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FiGithub className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
                <a
                  href="https://x.com/n1sup"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FiTwitter className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/naol-gezahegne/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="text-slate-400 hover:text-indigo-300 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-100 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

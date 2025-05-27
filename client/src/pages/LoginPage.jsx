"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if necessary
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiLoader,
  FiAlertCircle,
  FiUserPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Simple Input component for consistency
const FormInput = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  disabled = false,
}) => (
  <div className="relative">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    {Icon && (
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    )}
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={type === "password" ? "current-password" : type}
      required={required}
      disabled={disabled}
      className={`appearance-none relative block w-full px-3 py-3 ${
        Icon ? "pl-10" : ""
      }
                       border border-slate-600 bg-slate-700 placeholder-slate-400 text-slate-100
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                       transition shadow-sm disabled:opacity-50`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: authError } = useAuth(); // Renamed error to avoid conflict if needed elsewhere
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/problems"); // Or dashboard, or wherever users go after login
      }
      // If success is false, the error state in useAuth should be set
    } catch (err) {
      // Catch errors not handled by useAuth's login function itself
      console.error("Login page catch:", err);
      // You might want to set a generic error state here if useAuth doesn't cover it
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/30 p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block mb-4">
              {/* Brand Name - Consistent Gradient */}
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 hover:opacity-80 transition-opacity">
                LeetCoder
              </span>
            </Link>
            <h2 className="text-2xl font-semibold text-slate-100">
              Welcome Back!
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue your coding journey.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormInput
              id="email-address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              icon={FiMail}
              disabled={isLoading}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              icon={FiLock}
              disabled={isLoading}
            />

            {/* Error Message Display */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  key="authError"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-red-900/40 border border-red-700/60 text-red-300 px-3 py-2 rounded-md text-sm flex items-center"
                  role="alert"
                >
                  <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {authError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-indigo-500 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 focus:ring-offset-slate-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-slate-400"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white 
                                   bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 
                                   transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin h-5 w-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link to Register */}
          <div className="text-center text-sm text-slate-400 pt-4 border-t border-slate-700/50">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center justify-center mt-1"
            >
              Create one now <FiUserPlus className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

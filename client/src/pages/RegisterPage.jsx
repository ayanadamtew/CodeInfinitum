"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if necessary
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiLoader,
  FiAlertCircle,
  FiLogIn,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Reuse the FormInput component (or import if shared)
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
      autoComplete={
        type === "password"
          ? "new-password"
          : type === "email"
          ? "email"
          : type === "text"
          ? "username"
          : "off" // Basic autocomplete hints
      }
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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(""); // For client-side errors like password mismatch
  const { register, error: authError } = useAuth(); // Error from the auth context (backend)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(""); // Clear previous form errors

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      // Example: Basic password length validation
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      // register function likely handles setting its own error state via useAuth
      const success = await register(username, email, password);
      if (success) {
        navigate("/problems"); // Navigate on successful registration
      }
    } catch (err) {
      console.error("Register page catch:", err);
      // Set a generic error if register doesn't set one via context
      // setFormError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants (same as Login page)
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

  // Consolidate errors for display
  const displayError = formError || authError;

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
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 hover:opacity-80 transition-opacity">
                LeetCoder
              </span>
            </Link>
            <h2 className="text-2xl font-semibold text-slate-100">
              Create Your Account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Join the community and start coding!
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormInput
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              icon={FiUser}
              disabled={isLoading}
            />
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
              placeholder="Password (min. 6 characters)"
              icon={FiLock}
              disabled={isLoading}
            />
            <FormInput
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              icon={FiLock}
              disabled={isLoading}
            />

            {/* Error Message Display */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  key="regError"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-red-900/40 border border-red-700/60 text-red-300 px-3 py-2 rounded-md text-sm flex items-center"
                  role="alert"
                >
                  <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {displayError}
                </motion.div>
              )}
            </AnimatePresence>

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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <div className="text-center text-sm text-slate-400 pt-4 border-t border-slate-700/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center justify-center mt-1"
            >
              Sign In <FiLogIn className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import { FiLogIn, FiUserPlus, FiUser, FiLogOut, FiMenu, FiX, FiCode,FiMail,FiInfo, FiHome, FiGrid } from "react-icons/fi"; // Example icons
import { motion, AnimatePresence } from "framer-motion";

const NavLink = ({ to, children, onClick, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out group
                  ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-indigo-400 transition-all duration-300 ease-out group-hover:w-3/5
                    ${isActive ? "w-3/5" : "w-0"}`}
      />
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick, icon }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors duration-150"
  >
    {icon && <span className="mr-3 text-lg">{icon}</span>}
    {children}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home", exact: true, icon: <FiHome /> },
    { to: "/problems", label: "Problems", icon: <FiCode /> },
    { to: "/topics", label: "Topics", icon: <FiGrid /> },
    { to: "/about", label: "About", icon: <FiInfo /> },
    { to: "/contact", label: "Contact", icon: <FiMail /> },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group" onClick={() => setIsMenuOpen(false)}>
              {/* Simple text logo, can be replaced with an SVG */}
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:opacity-80 transition-opacity">
                CodeInfinitum
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-baseline space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} exact={item.exact}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Links / User Profile */}
          <div className="hidden md:flex items-center">
            {user ? (
              <>
                <NavLink to="/profile">
                  <FiUser className="inline mr-1" /> Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-3 flex items-center px-4 py-2 rounded-md text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm hover:shadow-md"
                >
                  <FiLogOut className="mr-1.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <FiLogIn className="inline mr-1" /> Login
                </NavLink>
                <Link
                  to="/register"
                  className="ml-3 flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-sm hover:shadow-md"
                >
                  <FiUserPlus className="mr-1.5" /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMenuOpen ? "x" : "menu"}
                  initial={{ rotate: isMenuOpen ? -90 : 0, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: isMenuOpen ? 0 : 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-slate-700/50"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                 <MobileNavLink
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
              ))}

              {user ? (
                <>
                  <MobileNavLink to="/profile" icon={<FiUser />} onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center mt-1 px-4 py-3 rounded-lg text-base font-medium text-rose-300 bg-rose-600/30 hover:bg-rose-600/50 hover:text-rose-100 transition-colors duration-150"
                  >
                    <FiLogOut className="mr-3 text-lg" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" icon={<FiLogIn />} onClick={() => setIsMenuOpen(false)}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/register" icon={<FiUserPlus />} onClick={() => setIsMenuOpen(false)}
                    className="block w-full mt-1 px-4 py-3 rounded-lg text-base font-medium text-indigo-300 bg-indigo-500/30 hover:bg-indigo-500/50 hover:text-indigo-100 transition-colors duration-150" // Custom styling for register button in mobile
                  >
                    Register
                  </MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
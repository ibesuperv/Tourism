// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white shadow-md fixed top-0 w-full z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight"
        >
          Karnataka Tourism
        </Link>

        <div className="flex gap-6">
          <NavLink to="/explore" label="Explore" />
          <NavLink to="/contribute" label="Contribute" />
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, label }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className="text-gray-700 font-medium hover:text-blue-600 transition"
      >
        {label}
      </Link>
    </motion.div>
  );
}

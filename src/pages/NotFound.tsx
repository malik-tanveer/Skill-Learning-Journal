import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function NotFound() {
  const [darkMode, setDarkMode] = useState(true);

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#1e293b]"
    : "bg-gradient-to-br from-white via-[#e2e8f0] to-[#cbd5e1]";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const cardBg = darkMode
    ? "bg-[#0f172a]/80 border-[#1e293b]"
    : "bg-white/80 border-gray-300";

  return (
    <div className={`min-h-screen ${bgGradient} flex items-center justify-center relative transition-colors duration-700`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/10 p-2 rounded-full hover:scale-110 transition"
      >
        {darkMode ? <Sun className="text-yellow-300 h-5 w-5" /> : <Moon className="text-gray-700 h-5 w-5" />}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative ${cardBg} border rounded-3xl p-10 w-[90%] sm:w-[450px] md:w-[500px] text-center flex flex-col items-center justify-center shadow-lg`}
      >
        <AlertCircle className={`w-16 h-16 mb-4 ${darkMode ? "text-red-400" : "text-red-600"}`} />
        <h1 className={`text-5xl font-bold mb-2 ${textColor}`}>404</h1>
        <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Oops! Page not found.</p>
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white py-2.5 px-6 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          Go Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

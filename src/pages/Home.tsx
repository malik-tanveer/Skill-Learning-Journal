import { motion } from "framer-motion";
import { BookMarked, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#1e293b] text-gray-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1e293b]/60 border border-[#334155] flex items-center justify-center">
            <BookMarked className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
          Skills Learning Journal
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8 font-medium">
          Track your learning journey, stay consistent, and visualize your progress 🚀
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-md transition"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/signup"
            className="border border-gray-500 hover:border-blue-500 text-gray-300 hover:text-blue-400 px-6 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 transition"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

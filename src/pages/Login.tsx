import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  Lock,
  BookMarked,
  LogIn,
  Sun,
  Moon,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#1e293b]"
    : "bg-gradient-to-br from-white via-[#e2e8f0] to-[#cbd5e1]";
  const cardBg = darkMode
    ? "bg-[#0f172a]/80 border-[#1e293b]"
    : "bg-white/80 border-gray-300";
  const textColor = darkMode ? "text-white" : "text-gray-900";

  return (
    <div
      className={`min-h-screen ${bgGradient} flex items-center justify-center overflow-hidden transition-colors duration-700`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/10 p-2 rounded-full hover:scale-110 transition"
      >
        {darkMode ? (
          <Sun className="text-yellow-300 h-5 w-5" />
        ) : (
          <Moon className="text-gray-700 h-5 w-5" />
        )}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative ${cardBg} border rounded-3xl p-10 w-[95%] sm:w-[460px] md:w-[500px] h-[620px] backdrop-blur-2xl shadow-lg flex flex-col justify-center`}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
              darkMode
                ? "bg-[#1e293b]/60 border-[#334155]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <BookMarked
              className={`w-8 h-8 ${
                darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            />
          </div>
          <h1 className={`text-3xl font-bold mt-4 tracking-tight ${textColor}`}>
            Skills Learning Journal
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Learn smarter • Track progress • Level up
          </p>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#0f172a] text-white font-medium py-2.5 rounded-full hover:bg-[#1e293b] transition"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5 invert"
            />
            Continue with GitHub
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4 text-gray-500">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="mx-3 text-sm uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-3 bg-red-900/20 px-3 py-2 rounded-lg text-center border border-red-700"
          >
            {error}
          </motion.p>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-7"
        >
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-8 pr-2 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${
                darkMode
                  ? "border-gray-700 text-gray-100 placeholder-gray-500"
                  : "border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-8 pr-10 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${
                darkMode
                  ? "border-gray-700 text-gray-100 placeholder-gray-500"
                  : "border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-full font-semibold shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login
          </motion.button>
        </motion.form>

        {/* Footer */}
        <p
          className={`text-sm text-center mt-6 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:underline font-semibold"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

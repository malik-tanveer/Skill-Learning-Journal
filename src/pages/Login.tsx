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
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const validatePassword = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(
        "Password must have 8+ chars including uppercase, lowercase, number, and special symbol."
      );
      return;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060618] via-[#0a0a24] to-[#101040] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft Neon Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.4),transparent_70%)] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[#0c0c2a]/80 border border-[#1e1e4d] rounded-2xl p-10 w-[95%] sm:w-[430px] shadow-[0_0_60px_rgba(0,180,255,0.15)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-400/40 shadow-lg">
            <BookMarked className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">
            Skills Learning Journal
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Learn smarter • Track progress • Level up
          </p>
        </div>

        {/* Social Logins */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-2.5 rounded-xl shadow-md hover:bg-gray-200 transition"
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
            className="w-full flex items-center justify-center gap-3 bg-[#1f2937] text-white font-medium py-2.5 rounded-xl shadow-md hover:bg-[#374151] transition"
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
        <div className="flex items-center my-6 text-gray-500">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="mx-3 text-sm uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-3 bg-red-950/30 px-3 py-2 rounded-lg text-center border border-red-800"
          >
            {error}
          </motion.p>
        )}

        {/* Email + Password */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="email"
                placeholder="you@skillsjournal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050515] border border-gray-700 pl-10 pr-3 py-2.5 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050515] border border-gray-700 pl-10 pr-10 py-2.5 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button with Icon */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-sky-600 transition flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login
          </motion.button>
        </motion.form>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-sky-400 hover:underline font-semibold"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

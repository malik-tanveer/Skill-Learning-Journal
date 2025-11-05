import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  User,
  Mail,
  Lock,
  BookMarked,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });

        await setDoc(doc(db, "users", auth.currentUser.uid), {
          name,
          email,
          createdAt: new Date(),
        });
      }

      toast.success("Signup successful! Welcome to Skills Learning Journal 🎉");
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
    <>
    <div
  className={`${bgGradient} flex items-center justify-center w-screen h-screen overflow-hidden transition-colors duration-700`}
>
  {/* Prevent Scrollbar */}
  <style>
    {`
      html, body {
        overflow: hidden;
        height: 100%;
      }
    `}
  </style>

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
    className={`relative ${cardBg} border rounded-3xl px-8 py-10 w-[90%] sm:w-[400px] md:w-[440px] backdrop-blur-2xl shadow-lg flex flex-col items-center justify-center`}
  >
    {/* Header */}
    <div className="flex flex-col items-center text-center mb-6">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-3 ${darkMode
          ? "bg-[#1e293b]/60 border-[#334155]"
          : "bg-gray-100 border-gray-300"
          }`}
      >
        <BookMarked
          className={`w-7 h-7 ${darkMode ? "text-blue-400" : "text-blue-700"}`}
        />
      </div>
      <h1
        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-gray-100" : "text-gray-900"
          }`}
      >
        Skills Learning Journal
      </h1>
      <p
        className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold`}
      >
        Create your Account
      </p>
    </div>

    {/* Error */}
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-400 text-xs mb-3 bg-red-900/20 px-3 py-2 rounded-lg text-center border border-red-700 w-full"
      >
        {error}
      </motion.p>
    )}

    {/* Form */}
    <motion.form
      onSubmit={handleSignup}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-4 w-full"
    >
      {/* Full Name */}
      <div className="relative">
        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full pl-7 pr-2 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${darkMode
              ? "border-gray-700 text-gray-100 placeholder-gray-500"
              : "border-gray-400 text-gray-900 placeholder-gray-500"
            }`}
          required
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full pl-7 pr-2 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${darkMode
              ? "border-gray-700 text-gray-100 placeholder-gray-500"
              : "border-gray-400 text-gray-900 placeholder-gray-500"
            }`}
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full pl-7 pr-8 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${darkMode
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
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full pl-7 pr-8 py-2 bg-transparent border-b focus:outline-none focus:border-blue-400 transition ${darkMode
              ? "border-gray-700 text-gray-100 placeholder-gray-500"
              : "border-gray-400 text-gray-900 placeholder-gray-500"
            }`}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {showConfirm ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        Sign Up
      </motion.button>
    </motion.form>

    {/* Footer */}
    <p
      className={`text-xs text-center mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"
        }`}
    >
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-400 hover:underline font-semibold"
      >
        Log in
      </Link>
    </p>
  </motion.div>
</div>

    </>
  );
}

// src/pages/Signup.tsx
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
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // password validation
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setError("Password must meet all strength requirements.");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070015] via-[#0a0228] to-[#12003d] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,70,255,0.4),transparent_70%)] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[#0d0222]/80 border border-[#31255f] rounded-2xl p-8 w-full max-w-md shadow-[0_0_60px_rgba(100,70,255,0.25)] backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/40 shadow-lg mx-auto">
            <Star className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">
            Join Skills Learning Journal
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your growth, improve daily, and visualize success.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-3 bg-red-950/30 px-3 py-2 rounded-lg text-center border border-red-800"
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
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#090015] border border-gray-700 pl-10 pr-3 py-2.5 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="email"
                placeholder="you@skilljournal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090015] border border-gray-700 pl-10 pr-3 py-2.5 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090015] border border-gray-700 pl-10 pr-10 py-2.5 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

            {/* Password Validation */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {Object.entries({
                "At least 8 characters": validations.length,
                "One uppercase letter": validations.upper,
                "One lowercase letter": validations.lower,
                "One number": validations.number,
                "One special character": validations.special,
              }).map(([rule, valid]) => (
                <div key={rule} className="flex items-center space-x-2">
                  {valid ? (
                    <CheckCircle2 className="text-green-400 w-4 h-4" />
                  ) : (
                    <XCircle className="text-gray-500 w-4 h-4" />
                  )}
                  <span
                    className={`${
                      valid ? "text-green-400" : "text-gray-500"
                    } text-xs`}
                  >
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-indigo-500 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition"
          >
            Sign Up
          </motion.button>
        </motion.form>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline font-semibold"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

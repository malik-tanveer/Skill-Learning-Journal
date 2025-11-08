import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Target, LineChart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const linkCls = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition border ${
      location.pathname === path
        ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
        : "hover:bg-slate-700/40 text-slate-200 border-slate-600/40"
    }`;

  return (
    <div className="w-full bg-slate-900/70 border-b border-slate-700/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Target className="w-5 h-5 text-blue-400" />
          <span>Skill Journal</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link className={linkCls("/skills")} to="/skills">
            <LayoutGrid className="w-4 h-4" /> Skills
          </Link>
          <Link className={linkCls("/progress")} to="/progress">
            <Target className="w-4 h-4" /> Progress
          </Link>
          <Link className={linkCls("/dashboard")} to="/dashboard">
            <LineChart className="w-4 h-4" /> Dashboard
          </Link>
          <button
            onClick={logout}
            className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;

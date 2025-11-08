import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Skill { id: string; name: string; }
interface ProgressLog { id: string; skillId: string; value?: number | null; date?: any; }

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  const skillsRef = useMemo(() => collection(db, "skills"), []);
  const logsRef = useMemo(() => collection(db, "progressLogs"), []);

  useEffect(() => {
    if (!user) return;
    const q = query(skillsRef, where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const arr: Skill[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
      setSkills(arr);
      if (!selectedSkill && arr[0]) setSelectedSkill(arr[0].id);
    });
    return () => unsub();
  }, [user, skillsRef]);

  useEffect(() => {
    if (!user) return;
    const q = query(logsRef, where("uid", "==", user.uid), orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: ProgressLog[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
      setLogs(arr);
    });
    return () => unsub();
  }, [user, logsRef]);

  const avgBySkill = skills.map((s) => {
    const vals = logs.filter((l) => l.skillId === s.id && typeof l.value === "number").map((l) => Number(l.value));
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { name: s.name, avg: Number(avg.toFixed(2)) };
  });

  const barData = {
    labels: avgBySkill.map((x) => x.name),
    datasets: [
      {
        label: "Average Progress",
        data: avgBySkill.map((x) => x.avg),
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
    },
  } as const;

  const selectedLogs = logs
    .filter((l) => l.skillId === selectedSkill && typeof l.value === "number")
    .sort((a, b) => (a.date?.toMillis?.() || 0) - (b.date?.toMillis?.() || 0));

  const lineData = {
    labels: selectedLogs.map((l) => (l.date?.toDate ? l.date.toDate().toLocaleDateString() : "")),
    datasets: [
      {
        label: "Progress",
        data: selectedLogs.map((l) => Number(l.value)),
        borderColor: "rgba(16,185,129,1)",
        backgroundColor: "rgba(16,185,129,0.4)",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
    },
  } as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Trend Skill:</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
            >
              {skills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-300" /> Average Progress by Skill
          </h2>
          <Bar data={barData} options={barOptions} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-300" /> Progress Trend
          </h2>
          <Line data={lineData} options={lineOptions} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

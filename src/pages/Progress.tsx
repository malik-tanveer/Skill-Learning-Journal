import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { NotebookPen, Plus, Target } from "lucide-react";
import NavBar from "../components/NavBar";

interface Skill { id: string; name: string; }
interface ProgressLog {
  id: string;
  skillId: string;
  note?: string;
  value?: number | null;
  period?: "daily" | "weekly";
  date?: any;
}

const Progress = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [note, setNote] = useState("");
  const [value, setValue] = useState<string>("");
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [logs, setLogs] = useState<ProgressLog[]>([]);

  const skillsRef = useMemo(() => collection(db, "skills"), []);
  const logsRef = useMemo(() => collection(db, "progressLogs"), []);

  useEffect(() => {
    if (!user) return;
    const q = query(skillsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items: Skill[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
      setSkills(items);
      if (!selectedSkill && items[0]) setSelectedSkill(items[0].id);
    });
    return () => unsub();
  }, [user, skillsRef]);

  useEffect(() => {
    if (!user || !selectedSkill) { setLogs([]); return; }
    const q = query(
      logsRef,
      where("uid", "==", user.uid),
      where("skillId", "==", selectedSkill),
      orderBy("date", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: ProgressLog[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
      setLogs(items);
    });
    return () => unsub();
  }, [user, selectedSkill, logsRef]);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSkill) return;
    await addDoc(logsRef, {
      uid: user.uid,
      skillId: selectedSkill,
      note: note.trim() || undefined,
      value: value ? Number(value) : null,
      period,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    setNote("");
    setValue("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-blue-400" /> Log Progress
          </h1>
        </div>

        <motion.form
          onSubmit={addLog}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 grid gap-3 md:grid-cols-6"
        >
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          >
            <option value="" disabled>
              Select a skill
            </option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="md:col-span-1 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Numeric progress (optional)"
            type="number"
            step="0.01"
            className="md:col-span-1 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notes (optional)"
            className="md:col-span-1 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          />
          <button
            type="submit"
            className="md:col-span-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Add Log
          </button>
        </motion.form>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Recent Logs
          </h2>
          <div className="space-y-3">
            {logs.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-slate-200 text-sm">{l.note || "No notes"}</div>
                  {typeof l.value === "number" && (
                    <div className="text-slate-400 text-xs">Value: {l.value}</div>
                  )}
                </div>
                <div className="text-slate-500 text-xs">
                  {l.date?.toDate ? l.date.toDate().toLocaleString() : "--"}
                </div>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="text-slate-500 text-sm">No logs yet for this skill.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;

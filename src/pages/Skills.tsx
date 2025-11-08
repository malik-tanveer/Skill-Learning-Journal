import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Plus, Trash2 } from "lucide-react";
import NavBar from "../components/NavBar";

interface Skill {
  id: string;
  name: string;
  milestones?: string[];
  createdAt?: any;
}

const Skills = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [milestonesText, setMilestonesText] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const skillsRef = useMemo(() => collection(db, "skills"), []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      skillsRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: Skill[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
      setSkills(items);
      setLoading(false);
    });
    return () => unsub();
  }, [user, skillsRef]);

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    const milestones = milestonesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await addDoc(skillsRef, {
      uid: user.uid,
      name: name.trim(),
      milestones: milestones.length ? milestones : undefined,
      createdAt: serverTimestamp(),
    });
    setName("");
    setMilestonesText("");
  };

  const removeSkill = async (id: string) => {
    await deleteDoc(doc(db, "skills", id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" /> Manage Skills
          </h1>
        </div>

        <motion.form
          onSubmit={addSkill}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 grid gap-3 md:grid-cols-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skill name (e.g., React, Piano)"
            className="md:col-span-1 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          />
          <input
            value={milestonesText}
            onChange={(e) => setMilestonesText(e.target.value)}
            placeholder="Milestones (comma separated)"
            className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
          />
          <button
            type="submit"
            className="md:col-span-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </motion.form>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && (
            <div className="text-slate-400">Loading...</div>
          )}
          {!loading && skills.length === 0 && (
            <div className="text-slate-400">No skills yet. Add your first skill above.</div>
          )}
          {skills.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div className="font-semibold">{s.name}</div>
                </div>
                <button
                  onClick={() => removeSkill(s.id)}
                  className="text-red-300 hover:text-red-400"
                  title="Delete Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {s.milestones && s.milestones.length > 0 && (
                <div className="text-sm text-slate-300">
                  <div className="mb-1 font-medium text-slate-200">Milestones</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {s.milestones.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Skills;

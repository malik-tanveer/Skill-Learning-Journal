// src/components/AnalyticsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface Skill {
  id: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  createdAt: any;
}

interface ProgressEntry {
  id: string;
  skillId: string;
  hours: number;
  createdAt: any;
}

const AnalyticsDashboard: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch skills
    const skillsQuery = query(
      collection(db, 'skills'),
      where('userId', '==', user.uid)
    );

    const unsubscribeSkills = onSnapshot(skillsQuery, (querySnapshot) => {
      const skillsData: Skill[] = [];
      querySnapshot.forEach((doc) => {
        skillsData.push({ id: doc.id, ...doc.data() } as Skill);
      });
      setSkills(skillsData);
    });

    // Fetch progress entries
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProgress = onSnapshot(progressQuery, (querySnapshot) => {
      const progressData: ProgressEntry[] = [];
      querySnapshot.forEach((doc) => {
        progressData.push({ id: doc.id, ...doc.data() } as ProgressEntry);
      });
      setProgressEntries(progressData);
    });

    return () => {
      unsubscribeSkills();
      unsubscribeProgress();
    };
  }, [user]);

  // Calculate stats
  const totalSkills = skills.length;
  const totalHours = progressEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const averageProgress = skills.length > 0 
    ? skills.reduce((sum, skill) => sum + (skill.currentLevel / skill.targetLevel) * 100, 0) / skills.length 
    : 0;

  // Most improved skill (based on progress percentage)
  const mostImprovedSkill = skills.length > 0 
    ? skills.reduce((prev, current) => 
        (prev.currentLevel / prev.targetLevel) > (current.currentLevel / current.targetLevel) ? prev : current
      )
    : null;

  // Recent activity (last 7 days)
  const lastWeekEntries = progressEntries.filter(entry => {
    const entryDate = entry.createdAt?.toDate?.();
    if (!entryDate) return false;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entryDate >= sevenDaysAgo;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Skills */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Skills</p>
              <p className="text-2xl font-bold mt-1">{totalSkills}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Target className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        {/* Total Hours */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Hours</p>
              <p className="text-2xl font-bold mt-1">{totalHours}h</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        {/* Average Progress */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Progress</p>
              <p className="text-2xl font-bold mt-1">{averageProgress.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Last 7 Days</p>
              <p className="text-2xl font-bold mt-1">{lastWeekEntries.length}</p>
              <p className="text-gray-400 text-xs">sessions</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Skills Progress</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span>{skill.currentLevel}/{skill.targetLevel}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(skill.currentLevel / skill.targetLevel) * 100}%` 
                    }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Most Improved Skill */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Most Improved</h3>
          {mostImprovedSkill ? (
            <div className="text-center py-4">
              <Award className="mx-auto mb-3 text-yellow-400" size={48} />
              <h4 className="text-xl font-bold text-yellow-400">{mostImprovedSkill.name}</h4>
              <p className="text-gray-300 mt-2">
                Progress: {((mostImprovedSkill.currentLevel / mostImprovedSkill.targetLevel) * 100).toFixed(1)}%
              </p>
              <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(mostImprovedSkill.currentLevel / mostImprovedSkill.targetLevel) * 100}%` 
                  }}
                  transition={{ duration: 1.5 }}
                  className="bg-yellow-500 h-3 rounded-full"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No skills data available</p>
          )}
        </motion.div>
      </div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const dayEntries = lastWeekEntries.filter(entry => {
              const entryDate = entry.createdAt?.toDate?.();
              return entryDate && entryDate.toDateString() === date.toDateString();
            });
            const dayHours = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
            
            return (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-400 mb-1">
                  {date.toLocaleDateString('en', { weekday: 'short' })}
                </p>
                <div 
                  className={`h-16 rounded-lg flex items-center justify-center ${
                    dayHours > 0 
                      ? dayHours > 2 
                        ? 'bg-green-600' 
                        : dayHours > 1 
                          ? 'bg-green-500' 
                          : 'bg-green-400'
                      : 'bg-gray-700'
                  }`}
                >
                  <span className="text-white text-xs font-bold">
                    {dayHours > 0 ? `${dayHours}h` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
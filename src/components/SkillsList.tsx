// src/components/SkillsList.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Target, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ProgressLog from './ProgressLog';

interface Skill {
  id: string;
  name: string;
  description: string;
  currentLevel: number;
  targetLevel: number;
  createdAt: any;
}

const SkillsList: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'skills'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const skillsData: Skill[] = [];
      querySnapshot.forEach((doc) => {
        skillsData.push({ id: doc.id, ...doc.data() } as Skill);
      });
      setSkills(skillsData);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteSkill = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteDoc(doc(db, 'skills', skillId));
    }
  };

  const updateSkillLevel = async (skillId: string, newLevel: number) => {
    await updateDoc(doc(db, 'skills', skillId), {
      currentLevel: newLevel,
      updatedAt: new Date()
    });
  };

  const toggleExpand = (skillId: string) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  if (skills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-400"
      >
        <Target size={48} className="mx-auto mb-4 opacity-50" />
        <p>No skills added yet. Start by adding your first skill!</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{skill.name}</h3>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-blue-400">
                <Edit size={16} />
              </button>
              <button 
                onClick={() => deleteSkill(skill.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {skill.description && (
            <p className="text-gray-300 mb-4 text-sm">{skill.description}</p>
          )}

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{skill.currentLevel}/{skill.targetLevel}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(skill.currentLevel / skill.targetLevel) * 100}%` 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Update Level:</span>
              <select
                value={skill.currentLevel}
                onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Log Toggle Button */}
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleExpand(skill.id)}
              className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg p-3 flex items-center justify-between transition-colors"
            >
              <span className="text-sm">Progress Log</span>
              {expandedSkill === skill.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.button>

            {/* Progress Log Section */}
            {expandedSkill === skill.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3"
              >
                <ProgressLog skillId={skill.id} skillName={skill.name} />
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-1 text-gray-400 text-xs mt-4">
            <Calendar size={12} />
            <span>
              {skill.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillsList;
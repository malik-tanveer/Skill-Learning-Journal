// src/components/SkillsList.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Target, Calendar, ChevronDown, X, MoreHorizontal } from 'lucide-react';
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
  startDate: string;
  createdAt: any;
}

const SkillsList: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    description: '', 
    targetLevel: 10 
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
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
        const data = doc.data();
        skillsData.push({ 
          id: doc.id, 
          name: data.name || '',
          description: data.description || '',
          currentLevel: data.currentLevel || 1,
          targetLevel: data.targetLevel || 10,
          startDate: data.startDate || '',
          createdAt: data.createdAt 
        } as Skill);
      });
      setSkills(skillsData);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteSkill = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteDoc(doc(db, 'skills', skillId));
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };


  const startEditing = (skill: Skill) => {
    setEditingSkill(skill.id);
    setEditForm({
      name: skill.name,
      description: skill.description || '',
      targetLevel: skill.targetLevel
    });
  };

  const cancelEditing = () => {
    setEditingSkill(null);
    setEditForm({ name: '', description: '', targetLevel: 10 });
  };

  const saveEdit = async (skillId: string) => {
    if (!editForm.name.trim()) return;

    try {
      await updateDoc(doc(db, 'skills', skillId), {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        targetLevel: editForm.targetLevel,
        updatedAt: new Date()
      });
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const toggleExpand = (skillId: string) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  const toggleDescription = (skillId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(skillId)) {
      newExpanded.delete(skillId);
    } else {
      newExpanded.add(skillId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const isDescriptionLong = (description: string) => {
    return description.length > 100;
  };

  const getTruncatedDescription = (description: string, skillId: string) => {
    if (expandedDescriptions.has(skillId) || !isDescriptionLong(description)) {
      return description;
    }
    return description.substring(0, 100) + '...';
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
          className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col"
          style={{ minHeight: '350px' }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white flex-1 pr-2 line-clamp-2">
              {skill.name}
            </h3>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => startEditing(skill)}
                className="text-gray-400 hover:text-blue-400 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                title="Edit skill"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteSkill(skill.id)}
                className="text-gray-400 hover:text-red-400 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                title="Delete skill"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>

          {/* Description with Scroll */}
          {skill.description && (
            <div className="mb-4 flex-1 min-h-0">
              <div className="bg-gray-750 rounded-lg p-3 h-full">
                <div className="text-gray-300 text-sm leading-relaxed overflow-y-auto max-h-32">
                  {getTruncatedDescription(skill.description, skill.id)}
                </div>
                
                {/* Show More/Less Button */}
                {isDescriptionLong(skill.description) && (
                  <button
                    onClick={() => toggleDescription(skill.id)}
                    className="text-blue-400 hover:text-blue-300 text-xs mt-2 flex items-center space-x-1 transition-colors"
                  >
                    <MoreHorizontal size={12} />
                    <span>
                      {expandedDescriptions.has(skill.id) ? 'Show Less' : 'Show More'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Progress Section - Only show progress bar, NO update dropdown */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Progress</span>
                <span className="text-white font-medium">
                  {skill.currentLevel}/{skill.targetLevel}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((skill.currentLevel / skill.targetLevel) * 100, 100)}%` 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Progress Log Section */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleExpand(skill.id)}
              className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg p-3 flex items-center justify-between transition-colors"
            >
              <span className="text-sm text-gray-300">Progress Log</span>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${
                  expandedSkill === skill.id ? 'rotate-180' : ''
                }`}
              />
            </motion.button>

            {/* Progress Log - Only shows for expanded skill */}
            <AnimatePresence>
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
            </AnimatePresence>
          </div>

          {/* Date Info */}
          <div className="flex items-center space-x-2 text-gray-400 text-xs mt-4 pt-3 border-t border-gray-700">
            <Calendar size={12} />
            <span className="truncate">
              Started: {skill.startDate ? 
                new Date(skill.startDate).toLocaleDateString() : 
                (skill.createdAt?.toDate?.().toLocaleDateString() || 'Recently')}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 p-6 rounded-2xl w-full max-w-md border border-gray-600 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Skill</h3>
                <button 
                  onClick={cancelEditing}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter skill name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Describe your learning goals..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Character limit: 500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Target Level: {editForm.targetLevel}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editForm.targetLevel}
                    onChange={(e) => setEditForm({ ...editForm, targetLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingSkill && saveEdit(editingSkill)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsList;
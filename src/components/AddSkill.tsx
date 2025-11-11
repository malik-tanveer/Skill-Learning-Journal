// src/components/AddSkill.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const AddSkill: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [targetLevel, setTargetLevel] = useState(5);
  const { user } = useAuth();

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !skillName.trim()) return;

    try {
      await addDoc(collection(db, 'skills'), {
        name: skillName,
        description,
        targetLevel,
        currentLevel: 1,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setSkillName('');
      setDescription('');
      setTargetLevel(5);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors"
      >
        <Plus size={20} />
        <span>Add New Skill</span>
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Skill</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Skill Name</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., React, Guitar, Spanish"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="What do you want to achieve?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Level: {targetLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddSkill;
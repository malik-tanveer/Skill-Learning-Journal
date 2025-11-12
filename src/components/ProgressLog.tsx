// src/components/ProgressLog.tsx (Temporary Fix)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Calendar, Clock, Trash2, Edit3, Save, X, Target, TrendingUp } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface ProgressEntry {
  id: string;
  skillId: string;
  content: string;
  hours: number;
  createdAt: any;
}

interface ProgressLogProps {
  skillId: string;
  skillName: string;
}

const ProgressLog: React.FC<ProgressLogProps> = ({ skillId, skillName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [hours, setHours] = useState(1);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editHours, setEditHours] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'progress'),
      where('skillId', '==', skillId),
      where('userId', '==', user.uid)
      // ORDER BY temporarily removed
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData: ProgressEntry[] = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() } as ProgressEntry);
      });
      // Client side sorting
      entriesData.sort((a, b) => 
        (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
      );
      setEntries(entriesData);
    });

    return () => unsubscribe();
  }, [skillId, user]);

  const addProgressEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    try {
      await addDoc(collection(db, 'progress'), {
        skillId,
        content: content.trim(),
        hours,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      setContent('');
      setHours(1);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding progress entry:', error);
    }
  };

  const deleteProgressEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      await deleteDoc(doc(db, 'progress', entryId));
    }
  };

  const startEditing = (entry: ProgressEntry) => {
    setEditingEntry(entry.id);
    setEditContent(entry.content);
    setEditHours(entry.hours);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setEditContent('');
    setEditHours(1);
  };

  const saveEdit = async (entryId: string) => {
    if (!editContent.trim()) return;

    await updateDoc(doc(db, 'progress', entryId), {
      content: editContent.trim(),
      hours: editHours,
      updatedAt: new Date()
    });

    setEditingEntry(null);
    setEditContent('');
    setEditHours(1);
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const averageHours = entries.length > 0 ? (totalHours / entries.length).toFixed(1) : 0;

  return (
    <div className="mt-3">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1 text-blue-400">
              <Clock size={14} />
              <span className="text-sm font-medium">{totalHours}h</span>
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1 text-green-400">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">{averageHours}h</span>
            </div>
            <span className="text-xs text-gray-400">Avg/Session</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1 text-purple-400">
              <Target size={14} />
              <span className="text-sm font-medium">{entries.length}</span>
            </div>
            <span className="text-xs text-gray-400">Sessions</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">New Entry</span>
        </motion.button>
      </div>

      {/* Progress Entries */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <BookOpen className="mx-auto mb-3 text-gray-500" size={32} />
              <p className="text-gray-400 text-sm">No progress entries yet</p>
              <p className="text-gray-500 text-xs mt-1">Start by adding your first learning session</p>
            </motion.div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-750 border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-colors"
              >
                {editingEntry === entry.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={editHours}
                          onChange={(e) => setEditHours(parseFloat(e.target.value))}
                          className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-gray-400 text-sm">hours</span>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => saveEdit(entry.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEditing}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-500/20 px-2 py-1 rounded-full">
                          <span className="text-blue-300 text-xs font-bold">{entry.hours}h</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400 text-xs">
                          <Calendar size={12} />
                          <span>
                            {entry.createdAt?.toDate?.().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) || 'Recently'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(entry)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                        >
                          <Edit3 size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteProgressEntry(entry.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                    
                    <p className="text-gray-200 text-sm leading-relaxed">{entry.content}</p>
                    
                    {entry.createdAt?.toDate && (
                      <div className="flex items-center space-x-1 text-gray-500 text-xs mt-3 pt-2 border-t border-gray-600">
                        <span>
                          Added: {entry.createdAt.toDate().toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Progress Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 p-6 rounded-2xl w-full max-w-md border border-gray-600 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Add Progress Entry</h3>
                  <p className="text-gray-400 text-sm mt-1">for {skillName}</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addProgressEntry} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    What did you learn or practice?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                    placeholder="Describe your learning experience, challenges, achievements..."
                    rows={4}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Time invested
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0.5"
                        max="24"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(parseFloat(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl transition-all font-medium shadow-lg"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressLog;
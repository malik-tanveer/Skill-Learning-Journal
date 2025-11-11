// src/components/ProgressLog.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Calendar, Clock, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  deleteDoc,
  doc,
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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'progress'),
      where('skillId', '==', skillId),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData: ProgressEntry[] = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() } as ProgressEntry);
      });
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
        content,
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

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="mt-2">
      {/* Add Progress Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-lg p-2 flex items-center justify-center space-x-2 transition-colors mb-3"
      >
        <Plus size={14} />
        <span className="text-sm">Add Progress Entry</span>
      </motion.button>

      {/* Total Hours Summary */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3 p-2 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>Total time: {totalHours}h</span>
          </div>
          <span>{entries.length} entries</span>
        </div>
      )}

      {/* Progress Entries */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-gray-400 text-center text-sm py-4">
            No progress entries yet. Add your first entry!
          </p>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700 border border-gray-600 rounded-lg p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <BookOpen size={12} className="text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium">{entry.hours}h</span>
                </div>
                <button 
                  onClick={() => deleteProgressEntry(entry.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              
              <p className="text-gray-200 text-sm mb-2">{entry.content}</p>
              
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <Calendar size={10} />
                <span>
                  {entry.createdAt?.toDate?.().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) || 'Recently'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Progress Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add Progress for {skillName}</h3>

            <form onSubmit={addProgressEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">What did you learn?</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Describe what you practiced or learned..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time spent (hours)</label>
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgressLog;
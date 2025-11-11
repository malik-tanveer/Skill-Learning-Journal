// src/pages/Home.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, BarChart3, Target } from 'lucide-react';
import AddSkill from '../components/AddSkill';
import SkillsList from '../components/SkillsList';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'analytics'>('skills');
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserName = () => {
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with User Info */}
      <header className="bg-navy-800 border-b border-navy-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-blue-500 p-2 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Skill Learning Journal</h1>
                <p className="text-gray-300 text-sm">Track your progress and master new skills</p>
              </div>
            </motion.div>

            {/* User Info and Logout */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {/* User Name */}
              <div className="text-right">
                <p className="text-white font-medium">Welcome, {getUserName()}</p>
                <p className="text-gray-400 text-sm">Ready to learn!</p>
              </div>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 border-b border-gray-700"
      >
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center space-x-2 px-6 py-4 rounded-t-lg transition-all ${
                activeTab === 'skills' 
                  ? 'bg-gray-900 text-white border-t-2 border-blue-500 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Target size={20} />
              <span className="font-medium">My Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-6 py-4 rounded-t-lg transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-gray-900 text-white border-t-2 border-blue-500 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Analytics</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'skills' ? (
          <>
            {/* Add Skill Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <AddSkill />
            </motion.section>

            {/* Skills Grid Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SkillsList />
            </motion.section>
          </>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  );
};

export default Home;
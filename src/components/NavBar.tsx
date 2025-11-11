// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  Settings, 
  ChevronDown, 
  BookOpen, 
  BarChart3,
  Target,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'skills' | 'analytics';
  setActiveTab: (tab: 'skills' | 'analytics') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserName = () => {
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="bg-navy-800 border-b border-navy-600 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SkillJournal</h1>
              <p className="text-gray-300 text-xs">Master Your Skills</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === 'skills' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Target size={18} />
                <span>My Skills</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitial()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-white text-sm font-medium">{getUserName()}</p>
                  <p className="text-gray-300 text-xs">{user?.email}</p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {getUserInitial()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{getUserName()}</p>
                          <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <User size={18} />
                        <span>Profile Settings</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Settings size={18} />
                        <span>Preferences</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded-lg mx-2"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-700 py-4"
            >
              {/* Mobile Navigation Tabs */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => {
                    setActiveTab('skills');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'skills' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Target size={20} />
                  <span>My Skills</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'analytics' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <BarChart3 size={20} />
                  <span>Analytics</span>
                </button>
              </div>

              {/* Mobile User Info */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getUserInitial()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{getUserName()}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1 mt-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg">
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded-lg"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
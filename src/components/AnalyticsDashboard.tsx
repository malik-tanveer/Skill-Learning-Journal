// src/components/AnalyticsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Award, Zap, Calendar } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Skill {
  id: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  createdAt: any;
  startDate: string;
}

interface ProgressEntry {
  id: string;
  skillId: string;
  hours: number;
  createdAt: any;
  skillName?: string;
}

// Chart Component
const ChartComponent: React.FC<{ 
  skills: any[]; 
  progressEntries: any[]; 
  chartType: 'pie' | 'line' | 'bar' | 'doughnut'; 
  dataType: 'time' | 'progress' | 'sessions'; 
}> = ({ skills, progressEntries, chartType, dataType }) => {
  
  const getChartData = () => {
    const skillData = skills.map(skill => {
      const skillEntries = progressEntries.filter(entry => entry.skillId === skill.id);
      const totalHours = skillEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const sessions = skillEntries.length;
      const progress = (skill.currentLevel / skill.targetLevel) * 100;

      return {
        name: skill.name,
        hours: totalHours,
        sessions,
        progress,
      };
    }).filter(skill => {
      if (dataType === 'time') return skill.hours > 0;
      if (dataType === 'sessions') return skill.sessions > 0;
      return true;
    });

    const sortedSkills = [...skillData].sort((a, b) => {
      if (dataType === 'time') return b.hours - a.hours;
      if (dataType === 'sessions') return b.sessions - a.sessions;
      return b.progress - a.progress;
    });

    const labels = sortedSkills.map(skill => skill.name);
    const data = sortedSkills.map(skill => {
      if (dataType === 'time') return skill.hours;
      if (dataType === 'sessions') return skill.sessions;
      return skill.progress;
    });

    // Color palette
    const colors = [
      '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
      '#06B6D4', '#84CC16', '#F97316', '#8B5CF6', '#EC4899',
      '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4', '#84CC16'
    ];

    return {
      labels,
      datasets: [
        {
          label: dataType === 'time' ? 'Hours Spent' : dataType === 'sessions' ? 'Sessions' : 'Progress %',
          data,
          backgroundColor: colors.slice(0, data.length),
          borderColor: colors.slice(0, data.length).map(color => color + 'DD'),
          borderWidth: chartType === 'pie' || chartType === 'doughnut' ? 2 : 1,
          borderRadius: chartType === 'bar' ? 8 : 0,
          borderSkipped: false,
        },
      ],
    };
  };

  const getChartOptions = (): ChartOptions<any> => {
    const commonOptions: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: chartType === 'pie' || chartType === 'doughnut' ? 'right' : 'top',
          labels: {
            color: '#9CA3AF',
            font: { size: 11 },
            usePointStyle: true,
            padding: 15,
          },
        },
        title: {
          display: true,
          color: '#F9FAFB',
          font: { size: 16, weight: 'bold' }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context: { dataset: { label: string; }; parsed: number | null; }) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed !== null) {
                if (dataType === 'progress') {
                  label += context.parsed.toFixed(1) + '%';
                } else {
                  label += context.parsed;
                  if (dataType === 'time') label += ' hours';
                  if (dataType === 'sessions') label += ' sessions';
                }
              }
              return label;
            }
          }
        },
      },
    };

    if (chartType === 'bar' || chartType === 'line') {
      return {
        ...commonOptions,
        scales: {
          x: {
            grid: { 
              color: '#374151',
              drawBorder: false,
            },
            ticks: { 
              color: '#9CA3AF',
              font: { size: 11 }
            },
          },
          y: {
            grid: { 
              color: '#374151',
              drawBorder: false,
            },
            ticks: {
              color: '#9CA3AF',
              font: { size: 11 },
              callback: function(value: string) {
                if (dataType === 'progress') return value + '%';
                return value;
              },
            },
            beginAtZero: true,
          },
        },
      };
    }

    return commonOptions;
  };

  const chartData = getChartData();

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      options: getChartOptions(),
    };

    switch (chartType) {
      case 'bar': return <Bar {...chartProps} />;
      case 'line': return <Line {...chartProps} />;
      case 'pie': return <Pie {...chartProps} />;
      case 'doughnut': return <Doughnut {...chartProps} />;
      default: return <Bar {...chartProps} />;
    }
  };

  if (skills.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-lg mb-1">No skills data available</p>
          <p className="text-sm">Add skills to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      {renderChart()}
    </div>
  );
};

// Main AnalyticsDashboard Component
const AnalyticsDashboard: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [chartType, setChartType] = useState<'pie' | 'line' | 'bar' | 'doughnut'>('pie');
  const [dataType, setDataType] = useState<'time' | 'progress' | 'sessions'>('progress');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

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

    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', user.uid)
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

  // Enhance progress entries with skill names
  const enhancedProgressEntries = progressEntries.map(entry => {
    const skill = skills.find(s => s.id === entry.skillId);
    return {
      ...entry,
      skillName: skill?.name || 'Unknown Skill'
    };
  });

  // Calculate stats
  const totalSkills = skills.length;
  const totalHours = enhancedProgressEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalSessions = enhancedProgressEntries.length;
  
  const averageProgress = skills.length > 0 
    ? skills.reduce((sum, skill) => sum + (skill.currentLevel / skill.targetLevel) * 100, 0) / skills.length 
    : 0;

  // Most improved skill
  const mostImprovedSkill = skills.length > 0 
    ? skills.reduce((prev, current) => 
        (prev.currentLevel / prev.targetLevel) > (current.currentLevel / current.targetLevel) ? prev : current
      )
    : null;

  // Progress categories
  const progressCategories = {
    beginner: skills.filter(s => (s.currentLevel / s.targetLevel) < 0.3).length,
    intermediate: skills.filter(s => (s.currentLevel / s.targetLevel) >= 0.3 && (s.currentLevel / s.targetLevel) < 0.7).length,
    advanced: skills.filter(s => (s.currentLevel / s.targetLevel) >= 0.7 && (s.currentLevel / s.targetLevel) < 1).length,
    completed: skills.filter(s => s.currentLevel >= s.targetLevel).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-400">Track your learning progress and insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Skills',
            value: totalSkills,
            icon: Target,
            color: 'blue',
            description: 'Active skills you are learning'
          },
          {
            label: 'Time Spent',
            value: `${totalHours}h`,
            icon: Clock,
            color: 'green',
            description: 'Total learning time'
          },
          {
            label: 'Total Sessions',
            value: totalSessions,
            icon: Calendar,
            color: 'purple',
            description: 'Practice sessions completed'
          },
          {
            label: 'Avg Progress',
            value: `${averageProgress.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'orange',
            description: 'Average across all skills'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 group hover:border-gray-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Main Chart Container */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold">Skills Analytics</h3>
              <p className="text-gray-400 text-sm">Visualize your learning progress</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Chart Type Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Chart Type:</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-w-32"
                >
                  <option value="pie">Pie Chart</option>
                  <option value="doughnut">Donut Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>
              </div>

              {/* Data Type Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Data Type:</label>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value as any)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-w-32"
                >
                  <option value="progress">Progress %</option>
                  <option value="time">Time Spent</option>
                  <option value="sessions">Sessions</option>
                </select>
              </div>
            </div>
          </div>

          <ChartComponent 
            skills={skills}
            progressEntries={enhancedProgressEntries}
            chartType={chartType}
            dataType={dataType}
          />
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="text-yellow-400" size={20} />
            <h3 className="text-lg font-semibold">Progress Overview</h3>
          </div>

          {/* Most Improved Skill */}
          {mostImprovedSkill && (
            <div className="text-center mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Zap className="text-yellow-400" size={20} />
                <h4 className="text-lg font-bold text-yellow-400">Most Improved</h4>
              </div>
              <p className="text-xl font-bold text-white mb-2">{mostImprovedSkill.name}</p>
              <p className="text-gray-300 text-sm mb-3">
                Progress: {((mostImprovedSkill.currentLevel / mostImprovedSkill.targetLevel) * 100).toFixed(1)}%
              </p>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(mostImprovedSkill.currentLevel / mostImprovedSkill.targetLevel) * 100}%` 
                  }}
                  transition={{ duration: 1.5 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Progress Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-300">Skills by Progress Level</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-750 rounded-lg p-4 text-center group hover:bg-gray-700 transition-colors border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300">
                  {progressCategories.beginner}
                </div>
                <div className="text-xs text-gray-400 mt-1">Beginner</div>
                <div className="text-xs text-blue-400 mt-1">&lt; 30%</div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4 text-center group hover:bg-gray-700 transition-colors border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300">
                  {progressCategories.intermediate}
                </div>
                <div className="text-xs text-gray-400 mt-1">Intermediate</div>
                <div className="text-xs text-yellow-400 mt-1">30-70%</div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4 text-center group hover:bg-gray-700 transition-colors border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 group-hover:text-green-300">
                  {progressCategories.advanced}
                </div>
                <div className="text-xs text-gray-400 mt-1">Advanced</div>
                <div className="text-xs text-green-400 mt-1">70-99%</div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4 text-center group hover:bg-gray-700 transition-colors border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400 group-hover:text-purple-300">
                  {progressCategories.completed}
                </div>
                <div className="text-xs text-gray-400 mt-1">Completed</div>
                <div className="text-xs text-purple-400 mt-1">100%</div>
              </div>
            </div>
          </div>

          {/* Total Stats */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <span>{totalHours}h total</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} />
                <span>{totalSessions} sessions</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
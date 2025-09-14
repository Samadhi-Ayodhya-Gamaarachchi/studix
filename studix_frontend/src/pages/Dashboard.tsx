// pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  todayTasks: number;
  weekTasks: number;
}

const Dashboard = () => {
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    todayTasks: 0,
    weekTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tasksData = res.data;
      // setTasks(tasksData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const totalTasks = tasksData.length;
      const completedTasks = tasksData.filter((task: Task) => task.completed).length;
      const pendingTasks = tasksData.filter((task: Task) => !task.completed).length;
      const overdueTasks = tasksData.filter((task: Task) => 
        !task.completed && task.dueDate && new Date(task.dueDate) < now
      ).length;
      const todayTasks = tasksData.filter((task: Task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      }).length;
      const weekTasks = tasksData.filter((task: Task) => {
        if (!task.dueDate || task.completed) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= now && taskDate <= weekFromNow;
      }).length;

      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        todayTasks,
        weekTasks
      });

      // Get recent tasks (last 5 created)
      const recent = tasksData
        .sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentTasks(recent);

      // Get upcoming tasks (next 5 with due dates)
      const upcoming = tasksData
        .filter((task: Task) => task.dueDate && !task.completed)
        .sort((a: Task, b: Task) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5);
      setUpcomingTasks(upcoming);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completionPercentage = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getGreeting()}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back to your personal productivity hub. Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold">🚨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Progress Overview</h2>
            <span className="text-sm text-gray-600">{Math.round(completionPercentage)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.todayTasks}</div>
              <div className="text-sm text-blue-600">Due Today</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.weekTasks}</div>
              <div className="text-sm text-purple-600">Due This Week</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-green-600">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Tasks</h2>
              <Link 
                to="/tasks" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-500">No tasks yet</p>
                <Link 
                  to="/tasks" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <button
                      onClick={() => toggleTask(task._id, task.completed)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {task.priority && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Deadlines</h2>
              <Link 
                to="/tasks" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-500">No upcoming deadlines</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <button
                      onClick={() => toggleTask(task._id, task.completed)}
                      className="w-4 h-4 rounded border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors"
                    >
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{task.title}</p>
                      <p className={`text-xs ${
                        new Date(task.dueDate!) < new Date() 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        Due: {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                    {task.priority && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/tasks" 
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">➕</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Add New Task</p>
                  <p className="text-sm text-gray-500">Create a new task</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/tasks" 
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">View All Tasks</p>
                  <p className="text-sm text-gray-500">Manage your tasks</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/profile" 
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Update Profile</p>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
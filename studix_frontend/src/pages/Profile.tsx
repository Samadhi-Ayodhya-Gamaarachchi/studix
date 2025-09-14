// pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface UserProfile {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  joinedDate?: string;
  avatar?: string;
}

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

const Profile = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<UserProfile>({} as UserProfile);
  const [stats, setStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        ...parsedUser,
        joinedDate: parsedUser.joinedDate || new Date().toISOString()
      });
      setEditForm({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        bio: parsedUser.bio || '',
        email: parsedUser.email || ''
      });
    }
    
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const tasks = res.data;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.completed).length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Calculate streaks (simplified - in real app, you'd track daily completions)
      const currentStreak = Math.floor(Math.random() * 15) + 1; // Mock data
      const longestStreak = Math.max(currentStreak + Math.floor(Math.random() * 10), currentStreak);
      
      setStats({
        totalTasks,
        completedTasks,
        completionRate,
        currentStreak,
        longestStreak
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, you'd send this to your backend
      const updatedUser = {
        ...user,
        ...editForm
      };
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || 'User';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(user.firstName, user.lastName, user.username)}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {getDisplayName()}
                  </h1>
                  <p className="text-gray-600 mb-1">@{user.username}</p>
                  <p className="text-gray-500 text-sm">
                    Member since {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'Recently'}
                  </p>
                  {user.bio && (
                    <p className="text-gray-700 mt-3 max-w-md">{user.bio}</p>
                  )}
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 self-start"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us a little about yourself..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalTasks}</div>
              <div className="text-gray-600 text-sm">Total Tasks</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedTasks}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.completionRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.currentStreak}</div>
              <div className="text-gray-600 text-sm">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Account Details & Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Username</span>
                <span className="font-medium text-gray-800">{user.username}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-800">
                  {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Account Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Achievement Highlights */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="font-medium text-gray-800">Task Master</div>
                  <div className="text-sm text-gray-600">Completed {stats.completedTasks} tasks</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  🔥
                </div>
                <div>
                  <div className="font-medium text-gray-800">Streak Champion</div>
                  <div className="text-sm text-gray-600">{stats.longestStreak} day longest streak</div>
                </div>
              </div>
              
              {stats.completionRate >= 80 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">High Performer</div>
                    <div className="text-sm text-gray-600">{stats.completionRate}% completion rate</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
            
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <span>🔒</span>
              Change Password
            </button>
            
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <span>📧</span>
              Email Preferences
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">Danger Zone</h3>
            <p className="text-red-600 text-sm mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
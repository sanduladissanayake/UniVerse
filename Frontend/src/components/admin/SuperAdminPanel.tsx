import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Shield, Building, Plus, Trash2, Edit } from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Club {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  admin?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export const SuperAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'clubs'>('users');

  // New admin form
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, clubsData] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllClubs(),
      ]);
      setUsers(usersData);
      setClubs(clubsData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createClubAdmin(adminForm);
      alert('Club admin created successfully!');
      setShowAdminForm(false);
      setAdminForm({ email: '', password: '', firstName: '', lastName: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create admin');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully');
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800',
      CLUB_ADMIN: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-green-100 text-green-800',
    };
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-purple-600" />
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage users, clubs, and administrators</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">{users.length}</div>
          <div className="text-blue-100">Total Users</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <Shield className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">
            {users.filter(u => u.role === 'CLUB_ADMIN').length}
          </div>
          <div className="text-purple-100">Club Admins</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <Building className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold mb-1">{clubs.length}</div>
          <div className="text-green-100">Active Clubs</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'clubs'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-5 h-5 inline mr-2" />
            Club Management
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">All Users</h2>
            <button
              onClick={() => setShowAdminForm(!showAdminForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Club Admin
            </button>
          </div>

          {/* Create Admin Form */}
          {showAdminForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Club Admin</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Create Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clubs Tab */}
      {activeTab === 'clubs' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg shadow-md p-6">
                {club.logoUrl && (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                  {club.description}
                </p>
                {club.admin && (
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Admin: {club.admin.firstName} {club.admin.lastName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

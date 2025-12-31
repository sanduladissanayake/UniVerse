import React, { useState, useEffect } from 'react';
import { adminAPI, clubAPI, fileAPI } from '../../services/api';
import { Users, Shield, Building, Plus, Trash2, Edit, Upload, X } from 'lucide-react';

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
  adminId?: number;
  membershipFee?: number;
  admin?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export const SuperAdminPanel: React.FC = () => {
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubAdmins, setClubAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'clubs' | 'admins' | 'users'>('clubs');

  // Club creation form states
  const [showClubForm, setShowClubForm] = useState(false);
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
    adminId: '',
    membershipFee: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Admin creation form states
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    clubId: '',
  });

  // Club edit form states
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editClubForm, setEditClubForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
    adminId: '',
    membershipFee: '',
  });
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState('');

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, clubsData, clubAdminsData] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllClubs(),
        adminAPI.getClubAdmins(),
      ]);
      setUsers(usersData);
      setClubs(clubsData);
      setClubAdmins(clubAdminsData);
      setError('');
    } catch (err) {
      setError('Failed to load data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Logo upload handlers
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const response = await fileAPI.uploadImage(file);
      if (response.success) {
        return response.filePath;
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload logo: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Club handlers
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let logoUrl = clubForm.logoUrl;
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (!uploadedUrl) return;
        logoUrl = uploadedUrl;
      }

      const newClub: any = {
        name: clubForm.name,
        description: clubForm.description,
        logoUrl: logoUrl,
      };

      if (clubForm.adminId) {
        newClub.adminId = parseInt(clubForm.adminId);
      }

      if (clubForm.membershipFee) {
        newClub.membershipFee = parseFloat(clubForm.membershipFee);
      }

      await clubAPI.createClub(newClub);
      setSuccess('Club created successfully!');
      resetClubForm();
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to create club: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteClub = async (clubId: number) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;

    try {
      await clubAPI.deleteClub(clubId);
      setSuccess('Club deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to delete club: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const startEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setEditClubForm({
      name: club.name,
      description: club.description,
      logoUrl: club.logoUrl || '',
      adminId: club.adminId?.toString() || '',
      membershipFee: club.membershipFee?.toString() || '',
    });
    setEditLogoPreview(club.logoUrl || '');
  };

  const handleUpdateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClubId) return;

    try {
      let logoUrl = editClubForm.logoUrl;
      if (editLogoFile) {
        const uploadedUrl = await uploadLogo(editLogoFile);
        if (!uploadedUrl) return;
        logoUrl = uploadedUrl;
      }

      const updatedClub: any = {
        name: editClubForm.name,
        description: editClubForm.description,
        logoUrl: logoUrl,
      };

      if (editClubForm.adminId) {
        updatedClub.adminId = parseInt(editClubForm.adminId);
      }

      if (editClubForm.membershipFee) {
        updatedClub.membershipFee = parseFloat(editClubForm.membershipFee);
      }

      await clubAPI.updateClub(editingClubId, updatedClub);
      setSuccess('Club updated successfully!');
      setEditingClubId(null);
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to update club: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const cancelEditClub = () => {
    setEditingClubId(null);
    setEditLogoFile(null);
    setEditLogoPreview('');
  };

  const resetClubForm = () => {
    setClubForm({ name: '', description: '', logoUrl: '', adminId: '', membershipFee: '' });
    setLogoFile(null);
    setLogoPreview('');
    setShowClubForm(false);
  };

  // Admin handlers
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (adminForm.password !== adminForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (adminForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const newAdmin: any = {
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        password: adminForm.password,
        role: 'CLUB_ADMIN',
      };

      if (adminForm.clubId) {
        newAdmin.clubId = parseInt(adminForm.clubId);
      }

      await adminAPI.createClubAdmin(newAdmin);
      setSuccess('Club admin created successfully!');
      resetAdminForm();
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to create admin: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to delete user: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const resetAdminForm = () => {
    setAdminForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', clubId: '' });
    setShowAdminForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Shield className="w-10 h-10 mr-3 text-blue-600" />
          Super Admin Panel
        </h1>
        <p className="text-gray-600">Manage clubs, club admins, and users</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'clubs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-5 h-5 inline mr-2" />
            Clubs
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'admins'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Club Admins
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            All Users
          </button>
        </div>
      </div>

      {/* Clubs Tab */}
      {activeTab === 'clubs' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Manage Clubs</h2>
            <button
              onClick={() => setShowClubForm(!showClubForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Club
            </button>
          </div>

          {/* Create Club Form */}
          {showClubForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Club</h3>
              <form onSubmit={handleCreateClub} className="space-y-4">
                {/* Logo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {logoPreview ? (
                    <div className="relative inline-block w-full">
                      <img
                        src={logoPreview}
                        alt="Club logo preview"
                        className="h-40 w-full object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload club logo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-input"
                  />
                  <label htmlFor="logo-input" className="block mt-2 cursor-pointer">
                    <div className="text-center text-sm text-gray-600">
                      {logoFile ? logoFile.name : 'Choose an image or drag and drop'}
                    </div>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Club Name"
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Club Description"
                  value={clubForm.description}
                  onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
                <input
                  type="number"
                  placeholder="Membership Fee (Optional)"
                  value={clubForm.membershipFee}
                  onChange={(e) => setClubForm({ ...clubForm, membershipFee: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
                <select
                  value={clubForm.adminId}
                  onChange={(e) => setClubForm({ ...clubForm, adminId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Club Admin (Optional)</option>
                  {clubAdmins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.firstName} {admin.lastName} ({admin.email})
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? 'Creating...' : 'Create Club'}
                  </button>
                  <button
                    type="button"
                    onClick={resetClubForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Clubs List */}
          <div className="space-y-4">
            {clubs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No clubs yet. Create your first club!</p>
              </div>
            ) : (
              clubs.map((club) => (
                <div key={club.id} className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${editingClubId === club.id ? 'ring-2 ring-blue-500' : ''}`}>
                  {editingClubId === club.id ? (
                    // Edit mode
                    <form onSubmit={handleUpdateClub} className="space-y-4">
                      {/* Logo for edit */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {editLogoPreview ? (
                          <div className="relative inline-block w-full">
                            <img
                              src={editLogoPreview}
                              alt="Club logo preview"
                              className="h-40 w-full object-cover rounded-lg mb-4"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setEditLogoFile(null);
                                setEditLogoPreview('');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">Click to change logo</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditLogoChange}
                          className="hidden"
                          id={`edit-logo-input-${club.id}`}
                        />
                        <label htmlFor={`edit-logo-input-${club.id}`} className="block mt-2 cursor-pointer">
                          <div className="text-center text-sm text-gray-600">
                            {editLogoFile ? editLogoFile.name : 'Choose an image or drag and drop'}
                          </div>
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="Club Name"
                        value={editClubForm.name}
                        onChange={(e) => setEditClubForm({ ...editClubForm, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <textarea
                        placeholder="Club Description"
                        value={editClubForm.description}
                        onChange={(e) => setEditClubForm({ ...editClubForm, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Membership Fee (Optional)"
                        value={editClubForm.membershipFee}
                        onChange={(e) => setEditClubForm({ ...editClubForm, membershipFee: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                      <select
                        value={editClubForm.adminId}
                        onChange={(e) => setEditClubForm({ ...editClubForm, adminId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Club Admin (Optional)</option>
                        {clubAdmins.map((admin) => (
                          <option key={admin.id} value={admin.id}>
                            {admin.firstName} {admin.lastName} ({admin.email})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditClub}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // View mode
                    <>
                      <div className="flex gap-4 mb-4">
                        {club.logoUrl && (
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
                          <p className="text-gray-600 mb-3">{club.description}</p>
                          {club.admin && (
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Admin:</strong> {club.admin.firstName} {club.admin.lastName}
                            </div>
                          )}
                          {club.membershipFee && (
                            <div className="text-sm text-gray-600">
                              <strong>Membership Fee:</strong> LKR {club.membershipFee.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditClub(club)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit club"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClub(club.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete club"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Users</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'CLUB_ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg inline-flex"
                          title="Delete user"
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
    </div>
  );
};

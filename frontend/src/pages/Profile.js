import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, FileText, Lock, Save, Trash2, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = React.useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const userData = response.data.user;
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/profile', profile);
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/profile');
      logout();
      window.location.href = '/login';
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    }
  };

  return (
    <div className="profile-page">
      <Navbar />

      <main className="main-content">
        <div className="profile-container">
          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          {/* Profile Info Section */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2>{profile.name}</h2>
                <p className="profile-email">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><User size={16} /> Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Mail size={16} /> Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="input-disabled"
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label><Phone size={16} /> Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div className="form-group">
                  <label><MapPin size={16} /> Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                    placeholder="Lahore, Pakistan"
                  />
                </div>
              </div>

              <div className="form-group">
                <label><FileText size={16} /> Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="profile-card">
            <h3><Lock size={20} /> Change Password</h3>
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary" disabled={passwordLoading}>
                <Lock size={18} /> {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="profile-card danger-zone">
            <h3><AlertTriangle size={20} /> Danger Zone</h3>
            <p>Once you delete your account, there is no going back. All your data will be permanently removed.</p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-danger"
              >
                <Trash2 size={18} /> Delete My Account
              </button>
            ) : (
              <div className="delete-confirm">
                <p>Are you absolutely sure? This cannot be undone.</p>
                <div className="confirm-actions">
                  <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} className="btn btn-danger">
                    Yes, Delete My Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

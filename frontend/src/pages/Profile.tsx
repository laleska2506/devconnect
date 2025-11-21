import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profilesApi } from '../services/api';

interface Profile {
  userId: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    try {
      const data = await profilesApi.get(user.id);
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        skills: data.skills?.join(', ') || '',
        hourlyRate: data.hourlyRate?.toString() || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const updated = await profilesApi.update(user.id, {
        bio: formData.bio,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      setProfile(updated);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <div className="card">
        {!editMode ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{user?.name}</h2>
              <button className="btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            {profile && (
              <>
                <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
                <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'Not set'}</p>
                <p><strong>Hourly Rate:</strong> {profile.hourlyRate ? `$${profile.hourlyRate}` : 'Not set'}</p>
                <p><strong>Rating:</strong> {profile.rating || 'N/A'}</p>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, Node.js, AWS"
              />
            </div>
            <div className="form-group">
              <label>Hourly Rate ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              />
            </div>
            <button className="btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              style={{ marginLeft: '10px' }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;


// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, CreditCard, Camera, Edit2, Check, X, Loader, AlertCircle } from 'lucide-react';

export function Profile() {
  const { user: authUser, refreshUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = userId ? parseInt(userId) : authUser?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    country: '',
    role: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [currentUserId, authUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/profile/${currentUserId}`);
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        username: response.data.username || '',
        phone: response.data.phone || '',
        bio: response.data.bio || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        country: response.data.country || '',
        role: response.data.role || ''
      });
      setPreviewImage(response.data.profile_picture_url);
      setError('');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.error || 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          profile_picture_url: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country
      };

      if (formData.profile_picture_url && formData.profile_picture_url.startsWith('data:')) {
        try {
          await axios.post(
            `${API_BASE_URL}/users/profile/${authUser.id}/picture`,
            { picture_base64: formData.profile_picture_url }
          );
        } catch (picErr) {
          console.warn('Picture upload failed:', picErr);
        }
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/profile/${authUser.id}`,
        updateData
      );

      setProfile(response.data.user);
      await refreshUser();
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = authUser?.id === currentUserId || authUser?.role === 'admin';

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader className="w-10 h-10 text-neon-blue animate-spin" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-card text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
             <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEditing ? 'Edit Profile' : 'My Profile'}
            </h1>
            <p className="text-gray-400">
              {isEditing ? 'Update your personal information' : 'View and manage your profile'}
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2"
            >
              <Check size={20} />
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden sticky top-24"
             >
               <div className="relative aspect-square bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt={formData.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-5xl font-bold text-white uppercase border border-white/20">
                      {(formData.full_name || formData.username || '?').charAt(0)}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white mb-2" size={32} />
                      <span className="text-white text-sm font-medium">Change Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
               </div>

               <div className="p-6 text-center">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {formData.full_name || `@${formData.username}`}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">@{formData.username}</p>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    formData.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    formData.role === 'teacher' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {formData.role}
                  </span>

                  {canEdit && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl transition-all border border-white/10"
                    >
                      <Edit2 size={16} /> Edit Profile
                    </button>
                  )}
               </div>
             </motion.div>
          </div>

          {/* Main Content Form/View */}
          <div className="lg:col-span-2">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8"
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  
                  {/* Bio Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <User size={20} className="text-neon-blue" /> About Me
                    </h3>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all resize-none text-white"
                        placeholder="Tell us a bit about yourself..."
                      />
                    ) : (
                      <p className="text-gray-400 leading-relaxed">
                        {formData.bio || "No bio yet."}
                      </p>
                    )}
                  </div>

                  <hr className="border-white/10" />

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Mail size={20} className="text-neon-blue" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                          />
                        ) : (
                          <p className="text-white font-medium">{formData.full_name || 'Not set'}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                         <p className="text-white font-medium truncate" title={formData.email}>{formData.email}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                            placeholder="+1 (555) 000-0000"
                          />
                        ) : (
                          <p className="text-white font-medium">{formData.phone || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-neon-blue" /> Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-medium text-gray-500">Street Address</label>
                         {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                          />
                        ) : (
                          <p className="text-white font-medium">{formData.address || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">City</label>
                         {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                          />
                        ) : (
                          <p className="text-white font-medium">{formData.city || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Country</label>
                         {isEditing ? (
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                          />
                        ) : (
                          <p className="text-white font-medium">{formData.country || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setPreviewImage(profile.profile_picture_url); // Revert image preview
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all font-bold border border-white/10"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-neon-blue hover:bg-neon-purple text-white py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader className="animate-spin" size={18} /> : <Check size={18} />}
                        Save Changes
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

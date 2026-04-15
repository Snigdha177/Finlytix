import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Globe, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    emailNotifications: user?.emailNotifications !== false,
    notificationThreshold: user?.notificationThreshold || 80,
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({
        name: formData.name,
        currency: formData.currency,
        emailNotifications: formData.emailNotifications,
        notificationThreshold: formData.notificationThreshold,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (changePassword.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Password changed successfully! (Demo only)');
    setChangePassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Layout>
      <div className="animate-fadeIn max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        {/* Profile Settings */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="input-field pl-10 opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input-field"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CHF">CHF (CHF)</option>
                  <option value="CNY">CNY (¥)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="SGD">SGD (S$)</option>
                  <option value="HKD">HKD (HK$)</option>
                  <option value="NZD">NZD (NZ$)</option>
                  <option value="ZAR">ZAR (R)</option>
                </select>
              </div>
              <div>
                <label className="label">Notification Threshold (%)</label>
                <input
                  type="number"
                  value={formData.notificationThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationThreshold: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  max="100"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={formData.emailNotifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailNotifications: e.target.checked,
                  })
                }
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="emailNotifications" className="cursor-pointer">
                Enable email notifications
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                value={changePassword.currentPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                value={changePassword.newPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                value={changePassword.confirmPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Update Password
            </button>
          </form>
        </div>

        {/* System Info */}
        <div className="card p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">System Information</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Finance Tracker v1.0 • All your financial data is securely stored and encrypted
          </p>
        </div>
      </div>
    </Layout>
  );
}

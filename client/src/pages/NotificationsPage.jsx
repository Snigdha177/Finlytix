import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useData } from '../hooks/useData';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markNotificationAsRead } = useData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      await fetchNotifications();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(error?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking notification:', error);
      toast.error(error?.message || 'Failed to mark as read');
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const getNotificationIcon = (type) => {
    const icons = {
      transaction: '💰',
      budget: '📊',
      category: '📁',
      alert: '⚠️',
    };
    return icons[type] || '📬';
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {unreadNotifications.length} unread
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No notifications yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Your notifications will appear here
            </p>
          </div>
        )}

        {!loading && unreadNotifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Unread</h2>
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="card p-4 border-l-4 border-primary bg-blue-50 dark:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl mt-1">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && readNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Earlier</h2>
            <div className="space-y-2">
              {readNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="card p-4 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl mt-1">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-danger transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  PieChart,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Transactions', path: '/transactions' },
    { icon: Tags, label: 'Categories', path: '/categories' },
    { icon: PieChart, label: 'Budgets', path: '/budgets' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
       
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 z-50 md:relative md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-primary">💰</div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

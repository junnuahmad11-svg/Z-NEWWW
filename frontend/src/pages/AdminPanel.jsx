import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutTemplate,
  Type,
  Users,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import AdminTemplates from '../components/admin/AdminTemplates';
import AdminFonts from '../components/admin/AdminFonts';
import AdminUsers from '../components/admin/AdminUsers';
import AdminAnalytics from '../components/admin/AdminAnalytics';

export default function AdminPanel() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/templates', icon: LayoutTemplate, label: 'Templates' },
    { path: '/admin/fonts', icon: Type, label: 'Fonts' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="h-screen flex bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-panel border-r border-dark-border">
        <div className="p-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500'
                    : 'text-gray-400 hover:bg-dark-card hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/templates" element={<AdminTemplates />} />
          <Route path="/fonts" element={<AdminFonts />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/" element={<AdminTemplates />} />
        </Routes>
      </main>
    </div>
  );
}

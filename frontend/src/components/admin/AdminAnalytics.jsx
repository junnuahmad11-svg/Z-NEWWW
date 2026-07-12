import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, LayoutTemplate, FolderOpen, TrendingUp } from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: analytics.users,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Active Templates',
      value: analytics.templates,
      icon: LayoutTemplate,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Projects',
      value: analytics.projects,
      icon: FolderOpen,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-dark-panel rounded-xl p-6 border border-dark-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Templates */}
      <div className="bg-dark-panel rounded-xl border border-dark-border p-6">
        <h2 className="text-xl font-semibold mb-4">Top Templates</h2>
        
        <div className="space-y-3">
          {analytics.topTemplates.map((template, index) => (
            <div
              key={template._id}
              className="flex items-center justify-between p-4 bg-dark-card rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-500">
                  {template.usageCount || 0}
                </div>
                <div className="text-xs text-gray-500">uses</div>
              </div>
            </div>
          ))}

          {analytics.topTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No templates used yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

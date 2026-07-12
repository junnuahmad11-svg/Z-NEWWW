import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  Video,
  Plus,
  Settings,
  LogOut,
  Play,
  Clock,
  Trash2,
  Crown,
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, templatesRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/templates'),
      ]);
      setProjects(projectsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const response = await axios.post('/api/projects', {
        name: 'Untitled Project',
        timeline: { tracks: [], duration: 0 },
        settings: {},
      });
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const useTemplate = async (template) => {
    try {
      const response = await axios.post('/api/projects', {
        name: `${template.name} Project`,
        timeline: { tracks: template.tracks, duration: template.duration },
        settings: {},
      });
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-panel border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Video size={24} />
              </div>
              <h1 className="text-xl font-bold">Video Editor Pro</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {user?.name}
              </span>
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition"
                >
                  <Crown size={16} />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="p-2 hover:bg-dark-card rounded-lg transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Templates Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Templates</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-dark-panel rounded-xl h-48 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="group bg-dark-panel rounded-xl overflow-hidden border border-dark-border hover:border-blue-500 transition cursor-pointer"
                  onClick={() => useTemplate(template)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                    {template.previewUrl ? (
                      <img
                        src={template.previewUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play size={48} className="text-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-sm font-medium">Use Template</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{template.duration}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <button
              onClick={createNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition"
            >
              <Plus size={20} />
              <span>New Project</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-dark-panel rounded-xl h-48 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-dark-panel rounded-xl border border-dark-border border-dashed">
              <Video size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">No projects yet</p>
              <button
                onClick={createNewProject}
                className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="group bg-dark-panel rounded-xl overflow-hidden border border-dark-border hover:border-blue-500 transition"
                >
                  <div
                    className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(`/editor/${project._id}`)}
                  >
                    <Play size={48} className="text-gray-600 group-hover:text-white transition" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{project.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

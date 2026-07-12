import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await axios.get('/api/admin/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!confirm('Delete this template?')) return;
    
    try {
      await axios.delete(`/api/admin/templates/${id}`);
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Template Management</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition"
        >
          <Plus size={20} />
          <span>Add Template</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-dark-panel rounded-xl overflow-hidden border border-dark-border"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                {template.previewUrl ? (
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Eye size={48} className="text-gray-600" />
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>{template.duration}s</span>
                  <span>•</span>
                  <span>{template.usageCount || 0} uses</span>
                  <span>•</span>
                  <span className={template.isActive ? 'text-green-500' : 'text-red-500'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-dark-card hover:bg-dark-border rounded-lg transition"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => deleteTemplate(template._id)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadTemplates();
          }}
        />
      )}
    </div>
  );
}

function TemplateModal({ template, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    duration: template?.duration || 10,
    tracks: JSON.stringify(template?.tracks || [
      {
        type: 'text',
        clips: [
          {
            type: 'text',
            text: 'Your Title',
            start: 0,
            end: 5,
            fontSize: 48,
            color: '#ffffff',
            animation: 'fade',
          },
        ],
      },
    ], null, 2),
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('duration', formData.duration);
      data.append('tracks', formData.tracks);
      
      if (preview) {
        data.append('preview', preview);
      }

      if (template) {
        await axios.put(`/api/admin/templates/${template._id}`, data);
      } else {
        await axios.post('/api/admin/templates', data);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {template ? 'Edit Template' : 'Add Template'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Template JSON
              </label>
              <textarea
                value={formData.tracks}
                onChange={(e) =>
                  setFormData({ ...formData, tracks: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                rows={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preview Image/Video
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPreview(e.target.files[0])}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-dark-card hover:bg-dark-border rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

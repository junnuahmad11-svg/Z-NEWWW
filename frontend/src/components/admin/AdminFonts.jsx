import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminFonts() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      const response = await axios.get('/api/admin/fonts');
      setFonts(response.data);
    } catch (error) {
      console.error('Error loading fonts:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFont = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = prompt('Enter font name:');
    if (!name) return;

    const category = prompt('Enter category (bold/cinematic/handwriting/minimal):');
    if (!category) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('font', file);
      formData.append('name', name);
      formData.append('category', category);

      await axios.post('/api/admin/fonts', formData);
      loadFonts();
    } catch (error) {
      console.error('Error uploading font:', error);
      alert('Error uploading font');
    } finally {
      setUploading(false);
    }
  };

  const toggleFont = async (id) => {
    try {
      await axios.patch(`/api/admin/fonts/${id}/toggle`);
      loadFonts();
    } catch (error) {
      console.error('Error toggling font:', error);
    }
  };

  const deleteFont = async (id) => {
    if (!confirm('Delete this font?')) return;

    try {
      await axios.delete(`/api/admin/fonts/${id}`);
      loadFonts();
    } catch (error) {
      console.error('Error deleting font:', error);
    }
  };

  const groupedFonts = fonts.reduce((acc, font) => {
    if (!acc[font.category]) acc[font.category] = [];
    acc[font.category].push(font);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Font Management</h1>
          <p className="text-gray-400">{fonts.length} total fonts</p>
        </div>
        
        <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition cursor-pointer">
          <Upload size={20} />
          <span>{uploading ? 'Uploading...' : 'Upload Font'}</span>
          <input
            type="file"
            accept=".ttf,.otf"
            onChange={uploadFont}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFonts).map(([category, categoryFonts]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {category} ({categoryFonts.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFonts.map((font) => (
                  <div
                    key={font._id}
                    className="bg-dark-panel rounded-lg p-4 border border-dark-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{font.name}</h3>
                        <p className="text-xs text-gray-500">
                          {font.format.toUpperCase()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleFont(font._id)}
                        className="p-1"
                      >
                        {font.isActive ? (
                          <ToggleRight size={24} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-500" />
                        )}
                      </button>
                    </div>

                    <div
                      className="bg-dark-card rounded p-3 mb-3 text-center"
                      style={{ fontFamily: font.name }}
                    >
                      <p className="text-xl">The Quick Brown Fox</p>
                      <p className="text-sm text-gray-400">AaBbCc 123</p>
                    </div>

                    <button
                      onClick={() => deleteFont(font._id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

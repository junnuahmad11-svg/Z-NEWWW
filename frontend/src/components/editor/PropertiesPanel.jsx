import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import axios from 'axios';

export default function PropertiesPanel() {
  const { selectedClip, updateClip, timeline } = useEditorStore();
  const [fonts, setFonts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadFonts();
    loadCategories();
  }, []);

  const loadFonts = async () => {
    try {
      const response = await axios.get('/api/fonts');
      setFonts(response.data);
      
      // Dynamically load font files
      response.data.forEach((font) => {
        if (!document.querySelector(`[data-font="${font.name}"]`)) {
          const style = document.createElement('style');
          style.setAttribute('data-font', font.name);
          style.textContent = `
            @font-face {
              font-family: "${font.name}";
              src: url("${font.url}") format("${font.format === 'ttf' ? 'truetype' : 'opentype'}");
            }
          `;
          document.head.appendChild(style);
        }
      });
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/fonts/categories');
      setCategories(['all', ...response.data]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const selectedClipData = React.useMemo(() => {
    if (!selectedClip) return null;
    
    for (const track of timeline.tracks) {
      const clip = track.clips?.find((c) => c.id === selectedClip);
      if (clip) return { track, clip };
    }
    return null;
  }, [selectedClip, timeline]);

  if (!selectedClipData) {
    return (
      <div className="w-80 bg-dark-panel border-l border-dark-border p-6">
        <div className="text-center text-gray-400">
          <p>Select a clip to edit properties</p>
        </div>
      </div>
    );
  }

  const { track, clip } = selectedClipData;

  const filteredFonts = selectedCategory === 'all'
    ? fonts
    : fonts.filter((f) => f.category === selectedCategory);

  return (
    <div className="w-80 bg-dark-panel border-l border-dark-border overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Properties</h3>
        </div>

        {clip.type === 'text' && (
          <>
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <textarea
                value={clip.text || ''}
                onChange={(e) =>
                  updateClip(track.id, clip.id, { text: e.target.value })
                }
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Font Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-dark-card text-gray-400 hover:bg-dark-border'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font ({filteredFonts.length} available)
              </label>
              <div className="max-h-64 overflow-auto space-y-2 bg-dark-card rounded-lg p-2">
                {filteredFonts.map((font) => (
                  <button
                    key={font._id}
                    onClick={() =>
                      updateClip(track.id, clip.id, { fontFamily: font.name })
                    }
                    className={`w-full p-3 text-left rounded-lg transition ${
                      clip.fontFamily === font.name
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-dark-border'
                    }`}
                    style={{ fontFamily: font.name }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Size: {clip.fontSize || 48}px
              </label>
              <input
                type="range"
                min="12"
                max="200"
                value={clip.fontSize || 48}
                onChange={(e) =>
                  updateClip(track.id, clip.id, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={clip.color || '#ffffff'}
                onChange={(e) =>
                  updateClip(track.id, clip.id, { color: e.target.value })
                }
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Animation */}
            <div>
              <label className="block text-sm font-medium mb-2">Animation</label>
              <select
                value={clip.animation || 'none'}
                onChange={(e) =>
                  updateClip(track.id, clip.id, { animation: e.target.value })
                }
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="none">None</option>
                <option value="fade">Fade In</option>
                <option value="slide">Slide In</option>
                <option value="zoom">Zoom In</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          </>
        )}

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Duration: {((clip.end || 0) - (clip.start || 0)).toFixed(2)}s
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={(clip.end || 0) - (clip.start || 0)}
            onChange={(e) =>
              updateClip(track.id, clip.id, {
                end: clip.start + parseFloat(e.target.value),
              })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

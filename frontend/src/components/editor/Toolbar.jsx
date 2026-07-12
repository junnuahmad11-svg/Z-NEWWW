import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import {
  Type,
  Image,
  Music,
  Scissors,
  Wand2,
  Layers,
} from 'lucide-react';

export default function Toolbar() {
  const { addTrack, addClip, selectedTrack } = useEditorStore();
  const [activeTab, setActiveTab] = useState('media');

  const tools = [
    { id: 'media', icon: Image, label: 'Media' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'effects', icon: Wand2, label: 'Effects' },
    { id: 'transitions', icon: Layers, label: 'Transitions' },
  ];

  const addTextLayer = () => {
    if (!selectedTrack) {
      addTrack('text');
    }
    // In a real implementation, this would add a text clip to the selected track
  };

  return (
    <div className="w-64 bg-dark-panel border-r border-dark-border flex flex-col">
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-2 border-b border-dark-border">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition ${
              activeTab === tool.id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-dark-card text-gray-400'
            }`}
          >
            <tool.icon size={20} />
            <span className="text-xs">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'text' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3">Text Styles</h3>
            {['Title', 'Subtitle', 'Caption', 'Lower Third'].map((style) => (
              <button
                key={style}
                onClick={addTextLayer}
                className="w-full p-4 bg-dark-card hover:bg-dark-border rounded-lg transition text-left"
              >
                <div className="font-semibold mb-1">{style}</div>
                <div className="text-xs text-gray-400">
                  Click to add {style.toLowerCase()}
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3">Media Library</h3>
            <label className="block w-full p-8 border-2 border-dashed border-dark-border hover:border-blue-500 rounded-lg transition cursor-pointer text-center">
              <Image size={32} className="mx-auto mb-2 text-gray-500" />
              <span className="text-sm text-gray-400">
                Click to upload media
              </span>
              <input type="file" className="hidden" accept="image/*,video/*" />
            </label>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3">Effects</h3>
            {['Blur', 'Glow', 'Vignette', 'Color Grading'].map((effect) => (
              <div
                key={effect}
                className="p-3 bg-dark-card rounded-lg hover:bg-dark-border transition cursor-pointer"
              >
                <div className="text-sm">{effect}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Settings } from 'lucide-react';
import axios from 'axios';

export default function EditorHeader({ project, saving, onSave }) {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.post('/api/export', {
        timeline: project.timeline,
        settings: { resolution: '1080p' },
      });
      alert('Export started! You will be notified when complete.');
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="h-14 bg-dark-panel border-b border-dark-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-dark-card rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-semibold">{project?.name || 'Untitled'}</span>
        {saving && (
          <span className="text-xs text-gray-400">Saving...</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-border rounded-lg transition disabled:opacity-50"
        >
          <Save size={16} />
          <span className="text-sm">Save</span>
        </button>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
        >
          <Download size={16} />
          <span className="text-sm">
            {exporting ? 'Exporting...' : 'Export'}
          </span>
        </button>
      </div>
    </header>
  );
}

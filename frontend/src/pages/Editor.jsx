import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditorStore } from '../store/editorStore';
import axios from 'axios';
import EditorHeader from '../components/editor/EditorHeader';
import Preview from '../components/editor/Preview';
import Timeline from '../components/editor/Timeline';
import Toolbar from '../components/editor/Toolbar';
import PropertiesPanel from '../components/editor/PropertiesPanel';

export default function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { timeline, setTimeline } = useEditorStore();
  const [project, setProject] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
      setTimeline(response.data.timeline);
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/dashboard');
    }
  };

  const saveProject = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      await axios.put(`/api/projects/${projectId}`, {
        name: project.name,
        timeline,
        settings: project.settings,
      });
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (projectId && timeline) {
        saveProject();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [projectId, timeline]);

  if (!project && projectId) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg overflow-hidden">
      <EditorHeader
        project={project}
        saving={saving}
        onSave={saveProject}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        
        <div className="flex-1 flex flex-col">
          <Preview />
          <Timeline />
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
}

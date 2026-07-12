import React, { useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Plus, Lock, Eye, EyeOff } from 'lucide-react';

export default function Timeline() {
  const {
    timeline,
    currentTime,
    zoom,
    setCurrentTime,
    addTrack,
    selectedClip,
    selectClip,
  } = useEditorStore();

  const timelineRef = useRef(null);

  const handleTimelineClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * (timeline.duration || 10);
    setCurrentTime(time);
  };

  const pixelsPerSecond = 100 * zoom;

  return (
    <div className="h-64 bg-dark-panel border-t border-dark-border flex flex-col">
      {/* Timeline Ruler */}
      <div className="h-8 bg-dark-card border-b border-dark-border flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {Array.from({ length: Math.ceil((timeline.duration || 10)) }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 border-l border-dark-border pl-2"
              style={{ width: `${pixelsPerSecond}px` }}
            >
              <span className="text-xs text-gray-500">{i}s</span>
            </div>
          ))}
        </div>
        
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{
            left: `${currentTime * pixelsPerSecond}px`,
          }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1" />
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-auto">
        {timeline.tracks.map((track, index) => (
          <div
            key={track.id}
            className="h-16 border-b border-dark-border flex"
          >
            {/* Track Header */}
            <div className="w-32 flex-shrink-0 bg-dark-card border-r border-dark-border p-2 flex items-center justify-between">
              <span className="text-sm truncate">
                {track.type} {index + 1}
              </span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-dark-border rounded">
                  {track.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>

            {/* Track Content */}
            <div
              ref={timelineRef}
              className="flex-1 relative bg-dark-bg"
              onClick={handleTimelineClick}
            >
              {track.clips?.map((clip) => (
                <div
                  key={clip.id}
                  className={`absolute h-12 top-2 rounded cursor-move ${
                    selectedClip === clip.id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  style={{
                    left: `${clip.start * pixelsPerSecond}px`,
                    width: `${(clip.end - clip.start) * pixelsPerSecond}px`,
                    background: clip.type === 'video'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : clip.type === 'text'
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectClip(clip.id);
                  }}
                >
                  <div className="p-2 text-xs truncate">
                    {clip.text || clip.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Track Button */}
        <div className="h-12 border-b border-dark-border flex items-center justify-center">
          <button
            onClick={() => addTrack('video')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-dark-card rounded-lg transition"
          >
            <Plus size={16} />
            <span>Add Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}

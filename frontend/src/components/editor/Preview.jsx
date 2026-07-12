import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function Preview() {
  const canvasRef = useRef(null);
  const {
    timeline,
    currentTime,
    playing,
    togglePlay,
    setCurrentTime,
  } = useEditorStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render timeline at current time
    renderFrame(ctx, currentTime);
  }, [currentTime, timeline]);

  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setCurrentTime(currentTime + 0.033); // 30 FPS
    }, 33);

    return () => clearInterval(interval);
  }, [playing, currentTime]);

  const renderFrame = (ctx, time) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Render each track's clips at current time
    timeline.tracks.forEach((track) => {
      track.clips?.forEach((clip) => {
        if (time >= clip.start && time <= clip.end) {
          renderClip(ctx, clip, time);
        }
      });
    });
  };

  const renderClip = (ctx, clip, time) => {
    if (clip.type === 'text') {
      ctx.fillStyle = clip.color || '#fff';
      ctx.font = `${clip.fontSize || 48}px ${clip.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.fillText(
        clip.text || 'Text',
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
      );
    }
    // Add more rendering logic for video, images, effects, etc.
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="max-w-full max-h-full bg-black shadow-2xl"
        />
      </div>

      <div className="bg-dark-panel border-t border-dark-border p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentTime(0)}
            className="p-2 hover:bg-dark-card rounded-lg transition"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition"
          >
            {playing ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={() => setCurrentTime(timeline.duration || 0)}
            className="p-2 hover:bg-dark-card rounded-lg transition"
          >
            <SkipForward size={20} />
          </button>

          <span className="ml-4 text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(timeline.duration || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

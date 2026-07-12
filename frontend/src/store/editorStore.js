import { create } from 'zustand';

export const useEditorStore = create((set, get) => ({
  timeline: {
    tracks: [],
    duration: 0,
  },
  currentTime: 0,
  zoom: 1,
  selectedTrack: null,
  selectedClip: null,
  playing: false,

  setTimeline: (timeline) => set({ timeline }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setZoom: (zoom) => set({ zoom }),
  
  selectTrack: (trackId) => set({ selectedTrack: trackId }),
  
  selectClip: (clipId) => set({ selectedClip: clipId }),
  
  togglePlay: () => set((state) => ({ playing: !state.playing })),
  
  addTrack: (type) => {
    const tracks = get().timeline.tracks;
    const newTrack = {
      id: Date.now().toString(),
      type,
      clips: [],
      locked: false,
      visible: true,
    };
    set({
      timeline: {
        ...get().timeline,
        tracks: [...tracks, newTrack],
      },
    });
  },
  
  addClip: (trackId, clip) => {
    const timeline = get().timeline;
    const tracks = timeline.tracks.map((track) => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: [...track.clips, { ...clip, id: Date.now().toString() }],
        };
      }
      return track;
    });
    set({ timeline: { ...timeline, tracks } });
  },
  
  updateClip: (trackId, clipId, updates) => {
    const timeline = get().timeline;
    const tracks = timeline.tracks.map((track) => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.map((clip) =>
            clip.id === clipId ? { ...clip, ...updates } : clip
          ),
        };
      }
      return track;
    });
    set({ timeline: { ...timeline, tracks } });
  },
  
  removeClip: (trackId, clipId) => {
    const timeline = get().timeline;
    const tracks = timeline.tracks.map((track) => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.filter((clip) => clip.id !== clipId),
        };
      }
      return track;
    });
    set({ timeline: { ...timeline, tracks } });
  },

  loadTemplate: (template) => {
    set({
      timeline: {
        tracks: template.tracks.map((track, index) => ({
          ...track,
          id: `track-${index}`,
          clips: track.clips?.map((clip, clipIndex) => ({
            ...clip,
            id: `clip-${index}-${clipIndex}`,
          })) || [],
        })),
        duration: template.duration,
      },
    });
  },
}));

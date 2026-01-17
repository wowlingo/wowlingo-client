import { create } from 'zustand';

interface AudioControlState {
    playingCardId: number | null;
    setPlayingCardId: (id: number | null) => void;
}

export const useAudioControlStore = create<AudioControlState>((set) => ({
    playingCardId: null,
    setPlayingCardId: (id) => set({ playingCardId: id }),
}));
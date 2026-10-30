import { AppLanguage, ToneProfileType } from '../types';

export interface AudioPlaybackState {
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentText: string;
  tone: ToneProfileType;
  speed: number; // 1.0 or 0.8
}

type AudioListener = (state: AudioPlaybackState) => void;

class AudioEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private intervalId: number | null = null;
  private listeners: Set<AudioListener> = new Set();
  private isSimulating = false;

  private state: AudioPlaybackState = {
    isPlaying: false,
    progress: 0,
    currentText: '',
    tone: 'CALM_GUIDE',
    speed: 1.0,
  };

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public setSpeed(speed: number) {
    this.state.speed = speed;
    this.notify();
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('SpeechSynthesis cancel error', err);
      }
    }
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isSimulating = false;
    this.state.isPlaying = false;
    this.state.progress = 0;
    this.notify();
  }

  public play(text: string, tone: ToneProfileType, lang: AppLanguage) {
    this.stop();

    if (!text || text.trim() === '') return;

    this.state.isPlaying = true;
    this.state.currentText = text;
    this.state.tone = tone;
    this.state.progress = 0;
    this.notify();

    // Check if browser has speech synthesis
    const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Rate based on tone profile
    let rate = 0.95;
    let pitch = 1.0;
    let volume = 1.0;

    switch (tone) {
      case 'URGENT_CALM':
        rate = 0.82; // 90-105 wpm
        pitch = 0.9;
        break;
      case 'CALM_GUIDE':
        rate = 0.95; // 110-125 wpm
        pitch = 1.0;
        break;
      case 'HUSHED_PRIVATE':
        rate = 0.88; // 100-115 wpm
        pitch = 0.95;
        volume = 0.8;
        break;
      case 'GENTLE_SUPPORT':
        rate = 0.86; // 95-110 wpm
        pitch = 0.92;
        break;
      case 'WARM_CELEBRATE':
        rate = 1.05; // 115-130 wpm
        pitch = 1.05;
        break;
    }

    // Apply user selected speed factor
    rate *= this.state.speed;

    const words = text.split(/\s+/).filter(Boolean);
    const estimatedSeconds = Math.max(3, (words.length / (100 * (rate / 0.95))) * 60);

    let speechWorked = false;

    if (hasSpeech) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        const langMap: Record<AppLanguage, string> = {
          en: 'en-US',
          am: 'am-ET',
          om: 'om-ET',
          har: 'am-ET',
        };
        utterance.lang = langMap[lang] || 'en-US';

        utterance.onend = () => {
          this.stop();
        };

        utterance.onerror = () => {
          // Fall back gracefully to timer animation
          if (!this.isSimulating) {
            this.startSimulation(estimatedSeconds);
          }
        };

        window.speechSynthesis.speak(utterance);
        this.currentUtterance = utterance;
        speechWorked = true;
      } catch (e) {
        speechWorked = false;
      }
    }

    // Run smooth visual progress loop for audio wave and captions
    this.startSimulation(estimatedSeconds, !speechWorked);
  }

  private startSimulation(durationSeconds: number, autoEnd = true) {
    this.isSimulating = true;
    const startTime = Date.now();
    const durationMs = durationSeconds * 1000;

    this.intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      this.state.progress = progress;
      this.notify();

      if (progress >= 1 && autoEnd) {
        this.stop();
      }
    }, 100);
  }
}

export const audioEngine = new AudioEngine();

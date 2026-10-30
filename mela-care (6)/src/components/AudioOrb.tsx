import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Gauge } from 'lucide-react';
import { audioEngine, AudioPlaybackState } from '../utils/audio';
import { AppLanguage, ToneProfileType } from '../types';

interface AudioOrbProps {
  spokenText: string;
  lang: AppLanguage;
  tone?: ToneProfileType;
  compact?: boolean;
}

export const AudioOrb: React.FC<AudioOrbProps> = ({
  spokenText,
  lang,
  tone = 'CALM_GUIDE',
  compact = false,
}) => {
  const [state, setState] = useState<AudioPlaybackState>({
    isPlaying: false,
    progress: 0,
    currentText: '',
    tone: 'CALM_GUIDE',
    speed: 1.0,
  });

  useEffect(() => {
    const unsub = audioEngine.subscribe((s) => setState(s));
    return () => unsub();
  }, []);

  const isCurrentAudio = state.isPlaying && state.currentText === spokenText;

  const handleToggle = () => {
    if (isCurrentAudio) {
      audioEngine.stop();
    } else {
      audioEngine.play(spokenText, tone, lang);
    }
  };

  const handleRepeat = () => {
    audioEngine.play(spokenText, tone, lang);
  };

  const handleSpeed = () => {
    const next = state.speed === 1.0 ? 0.8 : 1.0;
    audioEngine.setSpeed(next);
    if (isCurrentAudio) {
      audioEngine.play(spokenText, tone, lang);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border shrink-0 max-w-full overflow-hidden ${
          tone === 'URGENT_CALM'
            ? isCurrentAudio
              ? 'bg-[#DC2626] text-white border-red-600 shadow-xs animate-pulse'
              : 'bg-red-50 text-[#DC2626] border-red-200 hover:bg-red-100'
            : isCurrentAudio
            ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
            : 'bg-[#FFF0F3] text-[#881337] border-[#FBCFE8] hover:bg-[#FFE4E6]'
        }`}
        aria-label="Listen audio"
      >
        {isCurrentAudio ? (
          <VolumeX className="w-3.5 h-3.5 animate-pulse shrink-0" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="truncate">
          {isCurrentAudio
            ? lang === 'am' || lang === 'har' ? 'ማቆም' : lang === 'om' ? 'Dhaabi' : 'Pause'
            : lang === 'am' || lang === 'har' ? 'አዳምጪ' : lang === 'om' ? 'Dhaggeeffadhu' : 'Listen'}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`rounded-3xl p-3 sm:p-3.5 border transition-all w-full max-w-full overflow-hidden box-border ${
        tone === 'URGENT_CALM'
          ? 'bg-red-50/95 border-red-300'
          : isCurrentAudio
          ? 'bg-[#FFE4E6] border-[#881337] shadow-xs'
          : 'bg-[#FFF5F7] border-[#FBCFE8]'
      }`}
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
        {/* Main Audio Voice Button (Hear Button) */}
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-1 min-w-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] overflow-hidden ${
            tone === 'URGENT_CALM'
              ? 'bg-[#DC2626] text-white hover:bg-red-700 shadow-xs'
              : isCurrentAudio
              ? 'bg-[#881337] text-white shadow-xs'
              : 'bg-[#881337] text-white hover:bg-[#701A75]'
          }`}
          aria-label={isCurrentAudio ? 'Stop audio' : 'Listen audio'}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {isCurrentAudio ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            )}
          </div>
          <div className="text-left flex-1 min-w-0 overflow-hidden">
            <div className="font-bold text-xs sm:text-sm leading-tight truncate">
              {isCurrentAudio
                ? lang === 'am' || lang === 'har' ? 'እያነበበ ነው...' : lang === 'om' ? 'Dubbisaa jira...' : 'Speaking...'
                : lang === 'am' || lang === 'har' ? 'በድምፅ አዳምጪ' : lang === 'om' ? 'Sagaleen Dhaggeeffadhu' : 'Listen with Voice'}
            </div>
            <div className="text-[10px] text-white/80 font-normal leading-tight truncate">
              {isCurrentAudio
                ? lang === 'am' || lang === 'har' ? 'ለማቆም ይጫኑ' : lang === 'om' ? 'Dhaabuuf tuqaa' : 'Tap to stop'
                : lang === 'am' || lang === 'har' ? 'የእህትነት ድምፅ ለማዳመጥ' : lang === 'om' ? 'Ibsa sagaleetiif tuqaa' : 'Tap for gentle audio explanation'}
            </div>
          </div>
        </button>

        {/* Action Controls Group: Repeat & Speed Control */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Repeat Button */}
          <button
            type="button"
            onClick={handleRepeat}
            title="Repeat spoken text"
            aria-label="Repeat audio"
            className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-white border border-[#FBCFE8] text-[#881337] hover:bg-[#FFF0F3] active:scale-95 transition-all shadow-2xs shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Slow Voice Toggle (0.8x) */}
          <button
            type="button"
            onClick={handleSpeed}
            title="Pacing control"
            aria-label="Toggle voice speed"
            className={`h-9 sm:h-11 px-2 sm:px-2.5 rounded-2xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shrink-0 border ${
              state.speed === 0.8
                ? 'bg-[#E11D48] text-white border-[#BE123C]'
                : 'bg-white border-[#FBCFE8] text-[#881337] hover:bg-[#FFF0F3]'
            }`}
          >
            <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{state.speed === 0.8 ? '0.8x' : '1.0x'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when playing */}
      {isCurrentAudio && (
        <div className="w-full bg-[#FBCFE8] h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              tone === 'URGENT_CALM' ? 'bg-[#DC2626]' : 'bg-[#881337]'
            }`}
            style={{ width: `${Math.round(state.progress * 100)}%` }}
          />
        </div>
      )}

      {/* Subtitles box */}
      <div className="mt-2 text-xs text-[#4A0420] bg-white/90 p-2.5 rounded-2xl border border-[#FBCFE8] leading-relaxed break-words overflow-hidden">
        <span className="text-[10px] font-bold text-[#9D174D] uppercase tracking-wider block mb-0.5">
          {lang === 'am' || lang === 'har' ? 'የተነገረው ድምፅ' : lang === 'om' ? 'Sagalee Dubbifame' : 'Spoken Audio'}:
        </span>
        <p className={`line-clamp-3 sm:line-clamp-none ${isCurrentAudio ? 'font-bold text-[#881337]' : 'font-medium'}`}>
          "{spokenText}"
        </p>
      </div>
    </div>
  );
};

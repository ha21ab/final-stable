import React, { useState, useEffect } from 'react';
import {
  Heart,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Gamepad2,
  CalendarCheck,
  Volume2,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { evaluateKickSession, resolveText } from '../utils/compass';
import { AudioOrb } from './AudioOrb';
import { SisterhoodTicTacToe } from './SisterhoodTicTacToe';
import { triggerHaptic } from '../utils/telegram';

interface KickTapperProps {
  lang: AppLanguage;
  onEmergencyClick: () => void;
}

export const KickTapper: React.FC<KickTapperProps> = ({ lang, onEmergencyClick }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'manual'>('live');

  // Live session state
  const [kickCount, setKickCount] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);
  const [lastTapRipple, setLastTapRipple] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Manual past entry state
  const [manualKicks, setManualKicks] = useState<number>(10);
  const [manualMinutes, setManualMinutes] = useState<number>(45);

  useEffect(() => {
    const timer = setInterval(() => {
      const minutes = Math.floor((Date.now() - sessionStartTime) / (1000 * 60));
      setElapsedMinutes(minutes);
    }, 15000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Gentle Web Audio API synthesizer for kick confirmation chime (zero external files)
  const playSoftChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
      osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.15); // C5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleTapKick = () => {
    if (kickCount < 10) {
      const nextCount = kickCount + 1;
      setKickCount(nextCount);
      setLastTapRipple(true);
      setTimeout(() => setLastTapRipple(false), 300);
      playSoftChime();

      if (nextCount === 10) {
        triggerHaptic('success');
      } else {
        triggerHaptic('medium');
      }
    }
  };

  const handleReset = () => {
    triggerHaptic('selection');
    setKickCount(0);
    setSessionStartTime(Date.now());
    setElapsedMinutes(0);
  };

  // Active evaluation based on active tab
  const evaluation =
    activeTab === 'live'
      ? evaluateKickSession(kickCount, elapsedMinutes)
      : evaluateKickSession(manualKicks, manualMinutes);

  return (
    <div className="bg-white border border-[#FBCFE8] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#9D174D] uppercase tracking-wider block">
            {lang === 'am' || lang === 'har'
              ? 'የህፃን እንቅስቃሴ ቆጣሪ'
              : lang === 'om'
              ? 'Lakkooftuu Sochii Mucaa'
              : 'Fetal Movement Counter'}
          </span>
          <h3 className="text-lg font-black text-[#4A0420]">
            {lang === 'am' || lang === 'har'
              ? 'የፅንስ እንቅስቃሴ ምት'
              : lang === 'om'
              ? 'Rukuttaa Sochii Mucaa'
              : 'Kick Rhythm Tapper'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {activeTab === 'live' && (
            <>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  soundEnabled
                    ? 'bg-[#FFF0F3] border-[#FBCFE8] text-[#881337]'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}
                title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
                aria-label="Toggle chime"
              >
                <Volume2 className={`w-3.5 h-3.5 ${soundEnabled ? 'text-[#E11D48]' : 'text-gray-400'}`} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 px-2.5 rounded-xl text-[#783A4E] hover:text-[#4A0420] hover:bg-[#FFF0F3] text-xs font-bold flex items-center gap-1 border border-[#FBCFE8] transition-all active:scale-95"
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'am' || lang === 'har' ? 'እንደገና' : lang === 'om' ? 'Haaraa' : 'Reset'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mode Switcher: Live Session vs Quick Past Log */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF5F7] rounded-2xl border border-[#FBCFE8]">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('live');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'live'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'text-[#783A4E] hover:text-[#4A0420]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>
            {lang === 'am' || lang === 'har'
              ? 'ቀጥታ መቁጠሪያ & ጨዋታ'
              : lang === 'om'
              ? 'Lakkoofsa & Tapha'
              : 'Live Tap & Rest Game'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('manual');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'manual'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'text-[#783A4E] hover:text-[#4A0420]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>
            {lang === 'am' || lang === 'har'
              ? 'ቀድመው የቆጠሩትን መዝግብ'
              : lang === 'om'
              ? 'Kan Duraanii Galmeessi'
              : 'Quick Past Entry'}
          </span>
        </button>
      </div>

      {/* TAB 1: LIVE COUNTING WITH PROMINENT TOP BUTTON + SISTERHOOD TIC-TAC-TOE */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {/* Prominent Tap Button */}
          <div className="py-2 flex flex-col items-center justify-center text-center">
            <button
              type="button"
              onClick={handleTapKick}
              aria-label="Tap each time baby kicks"
              className={`relative w-40 h-40 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
                kickCount >= 10
                  ? 'bg-[#881337] text-white'
                  : 'bg-[#FFF0F3] border-4 border-[#881337] text-[#881337] hover:bg-[#FFE4E6]'
              }`}
            >
              {lastTapRipple && (
                <span className="absolute inset-0 rounded-full border-4 border-[#E11D48] animate-ping opacity-75" />
              )}

              <Heart
                className={`w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-150 ${
                  lastTapRipple ? 'scale-125 text-[#E11D48]' : 'scale-100'
                }`}
              />
              <span className="text-3xl font-black mt-1 leading-none">
                {kickCount} / 10
              </span>
              <span className="text-[11px] font-bold mt-1 opacity-90">
                {kickCount >= 10
                  ? lang === 'am' || lang === 'har'
                    ? 'ተጠናቋል ✓'
                    : lang === 'om'
                    ? 'Xumurame ✓'
                    : 'Complete ✓'
                  : lang === 'am' || lang === 'har'
                  ? 'ሲንቀሳቀስ እዚህ ይጫኑ'
                  : lang === 'om'
                  ? 'Sochii irratti tuqaa'
                  : 'Tap on Kick'}
              </span>
            </button>

            {/* Progress 10 Dots */}
            <div className="flex items-center gap-2 mt-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < kickCount ? 'bg-[#881337] scale-110' : 'bg-[#FBCFE8]'
                  }`}
                />
              ))}
            </div>

            {/* Timer status */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#783A4E] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#881337]" />
              <span>
                {lang === 'am' || lang === 'har'
                  ? `ቆይታ፡ ~${elapsedMinutes} ደቂቃ (ግቡ፡ በ120 ደቂቃ ውስጥ 10 እንቅስቃሴዎች)`
                  : lang === 'om'
                  ? `Yeroo: ~${elapsedMinutes} daqiiqaa (Galma: daqiiqaa 120 keessatti sochii 10)`
                  : `Session time: ~${elapsedMinutes} mins (Target: 10 kicks within 120 mins)`}
              </span>
            </div>
          </div>

          {/* Integrated Resting Game: Tic-Tac-Toe */}
          <SisterhoodTicTacToe
            lang={lang}
            onMoveMade={() => {
              // subtle interaction confirmation
            }}
          />
        </div>
      )}

      {/* TAB 2: QUICK PAST LOG ENTRY (For mothers who count offline / earlier) */}
      {activeTab === 'manual' && (
        <div className="bg-[#FFF5F7] p-4 rounded-2xl border border-[#FBCFE8] space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#881337] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              {lang === 'am' || lang === 'har'
                ? 'ቀድመው በድንጋይ ወይም በማስታወሻ የቆጠሩትን እዚህ ያስገቡ'
                : lang === 'om'
                ? 'Kan duraan dhagaa ykn yaadaan lakkooftan asitti galmeessaa'
                : 'Log counts you completed earlier today'}
            </span>
            <p className="text-[11px] text-[#783A4E]">
              {lang === 'am' || lang === 'har'
                ? 'ስልኩን ሳይከፍቱ የቆጠሩትን ቁጥር እና የፈጀውን ደቂቃ መርጠው ወዲያውኑ የጤና ደረጃውን ይወቁ።'
                : lang === 'om'
                ? 'Baay’ina sochii fi yeroo fudhate galchuun battalumatti qoradhaa.'
                : 'Select the kicks felt and time taken to verify your baby’s safety status immediately.'}
            </p>
          </div>

          {/* Stepper: Number of Kicks */}
          <div className="bg-white p-3.5 rounded-xl border border-[#FBCFE8] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#4A0420] block">
                {lang === 'am' || lang === 'har' ? 'የተሰሙ እንቅስቃሴዎች ብዛት' : lang === 'om' ? 'Baay’ina Sochii' : 'Number of Kicks Felt'}
              </span>
              <span className="text-[10px] text-[#783A4E]">
                {lang === 'am' || lang === 'har' ? 'ደረጃው፡ 10 ወይም ከዚያ በላይ' : lang === 'om' ? 'Ulaagaa: 10 ykn isaa ol' : 'Target: 10 or more'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualKicks(Math.max(1, manualKicks - 1))}
                className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#FBCFE8] text-base font-black text-[#881337] flex items-center justify-center hover:bg-[#FFE4E6] active:scale-95"
              >
                -
              </button>
              <span className="w-8 text-center text-lg font-black text-[#881337]">
                {manualKicks}
              </span>
              <button
                type="button"
                onClick={() => setManualKicks(Math.min(25, manualKicks + 1))}
                className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#FBCFE8] text-base font-black text-[#881337] flex items-center justify-center hover:bg-[#FFE4E6] active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Stepper: Duration Minutes */}
          <div className="bg-white p-3.5 rounded-xl border border-[#FBCFE8] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#4A0420] block">
                {lang === 'am' || lang === 'har' ? 'የፈጀው ጊዜ (ደቂቃዎች)' : lang === 'om' ? 'Yeroo Fudhate (Daqiiqaa)' : 'Duration (Minutes)'}
              </span>
              <span className="text-[10px] text-[#783A4E]">
                {lang === 'am' || lang === 'har' ? 'በ2 ሰዓት (120 ደቂቃ) ውስጥ' : lang === 'om' ? 'Daqiiqaa 120 keessatti' : 'Within 120 minutes max'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualMinutes(Math.max(15, manualMinutes - 15))}
                className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#FBCFE8] text-base font-black text-[#881337] flex items-center justify-center hover:bg-[#FFE4E6] active:scale-95"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-black text-[#881337]">
                {manualMinutes} m
              </span>
              <button
                type="button"
                onClick={() => setManualMinutes(Math.min(180, manualMinutes + 15))}
                className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#FBCFE8] text-base font-black text-[#881337] flex items-center justify-center hover:bg-[#FFE4E6] active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spoken Companion */}
      <AudioOrb
        spokenText={resolveText(evaluation.message, lang)}
        tone={evaluation.status === 'alert' ? 'URGENT_CALM' : 'CALM_GUIDE'}
        lang={lang}
      />

      {/* Clinical Evaluation Result */}
      {evaluation.status === 'healthy' && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-[#4A0420] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed font-semibold">
            {resolveText(evaluation.message, lang)}
          </div>
        </div>
      )}

      {evaluation.status === 'alert' && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-300 text-red-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#DC2626]">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            <span>
              {lang === 'am' || lang === 'har'
                ? 'ከ10 በታች እንቅስቃሴ ተመዝግቧል'
                : lang === 'om'
                ? 'Sochii 10 gadi galmaa’eera'
                : 'Fewer than 10 kicks detected'}
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            {resolveText(evaluation.message, lang)}
          </p>
          <button
            type="button"
            onClick={onEmergencyClick}
            className="w-full py-3 rounded-2xl bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            {lang === 'am' || lang === 'har'
              ? 'የአስቸኳይ ጊዜ ካርድ ክፈት እና 907 ደውል'
              : lang === 'om'
              ? 'Kaardii Hatattamaa Banaatii 907 Bilbilaa'
              : 'Open Emergency Beacon & Call 907'}
          </button>
        </div>
      )}
    </div>
  );
};

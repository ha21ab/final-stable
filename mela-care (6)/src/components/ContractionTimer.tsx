import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Square,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  Wind,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface ContractionRecord {
  id: string;
  startTime: number;
  durationSeconds: number;
  intervalMinutes: number | null; // interval from previous contraction start
}

interface ContractionTimerProps {
  lang: AppLanguage;
  onEmergencyClick: () => void;
}

export const ContractionTimer: React.FC<ContractionTimerProps> = ({
  lang,
  onEmergencyClick,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStartTime, setCurrentStartTime] = useState<number | null>(null);
  const [currentDuration, setCurrentDuration] = useState<number>(0);
  const [history, setHistory] = useState<ContractionRecord[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isActive && currentStartTime) {
      interval = window.setInterval(() => {
        setCurrentDuration(Math.floor((Date.now() - currentStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentStartTime]);

  useEffect(() => {
    if (!showBreathing) return;
    const breathInterval = window.setInterval(() => {
      setBreathStep((step) => (step + 1) % 10);
    }, 1000);
    return () => window.clearInterval(breathInterval);
  }, [showBreathing]);

  const handleToggle = () => {
    if (!isActive) {
      // Start contraction
      triggerHaptic('medium');
      setCurrentStartTime(Date.now());
      setCurrentDuration(0);
      setIsActive(true);
    } else {
      // Stop contraction & record
      triggerHaptic('success');
      setIsActive(false);
      if (currentStartTime) {
        const duration = Math.max(5, currentDuration);
        const lastRecord = history[0];
        const intervalMins = lastRecord
          ? Math.round((currentStartTime - lastRecord.startTime) / (1000 * 60))
          : null;

        const record: ContractionRecord = {
          id: `con-${Date.now()}`,
          startTime: currentStartTime,
          durationSeconds: duration,
          intervalMinutes: intervalMins,
        };
        setHistory([record, ...history].slice(0, 8)); // keep last 8
      }
      setCurrentStartTime(null);
      setCurrentDuration(0);
    }
  };

  const handleReset = () => {
    triggerHaptic('selection');
    setIsActive(false);
    setCurrentStartTime(null);
    setCurrentDuration(0);
    setHistory([]);
    setShowBreathing(false);
    setBreathStep(0);
  };

  // Evaluate 5-1-1 Rule: contractions ~5 mins apart, ~60s duration, over last few logs
  const is511Labor =
    history.length >= 3 &&
    history.slice(0, 3).every(
      (h) =>
        h.durationSeconds >= 45 &&
        h.intervalMinutes !== null &&
        h.intervalMinutes <= 6
    );

  return (
    <div className="bg-white border border-[#FBCFE8] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#9D174D] uppercase tracking-wider block">
            {lang === 'am' || lang === 'har'
              ? 'የምጥ ቆጣሪ'
              : lang === 'om'
              ? 'Lakkooftuu Yeroo Ciniinsuu'
              : 'Labor Contraction Interval Timer'}
          </span>
          <h3 className="text-lg font-black text-[#4A0420]">
            {lang === 'am' || lang === 'har'
              ? 'የምጥ ቆጣሪ'
              : lang === 'om'
              ? 'Seera Ciniinsuu 5-1-1'
              : 'Labor Timer'}
          </h3>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 px-2.5 rounded-xl text-[#783A4E] hover:text-[#4A0420] text-xs font-bold flex items-center gap-1 border border-[#FBCFE8]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'am' || lang === 'har' ? 'እንደገና' : 'Reset'}</span>
          </button>
        )}
      </div>

      <p className="text-xs text-[#783A4E] leading-relaxed">
        {lang === 'am' || lang === 'har'
          ? 'ቁርጠት ሲጀምር ይጫኑ፤ ሲያቆም መልሰው ይጫኑ። በየ5 ደቂቃው የሚመጣና ለ1 ደቂቃ የሚቆይ ከሆነ ትክክለኛ ምጥ ስለሆነ ወደ ሆስፒታል ይሂዱ!'
          : lang === 'om'
          ? 'Ciniinsuun yeroo jalqabu tuqaa; yeroo dhaabbatu deebisaa tuqaa. Daqiiqaa 5n 5tti kan dhufu yoo ta’e gara hospitaalaa deemaa!'
          : 'Tap when contraction starts, tap again when it fades. If contractions arrive every 5 mins, last 1 min for 1 hour: go to the hospital!'}
      </p>

      {/* Main Big Start/Stop Contraction Button */}
      <div className="py-2 flex flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
            isActive
              ? 'bg-[#DC2626] text-white animate-pulse'
              : 'bg-[#FFF0F3] border-4 border-[#881337] text-[#881337] hover:bg-[#FFE4E6]'
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-10 h-10 fill-white text-white mb-1" />
              <span className="text-3xl font-black">{currentDuration}s</span>
              <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">
                {lang === 'am' || lang === 'har'
                  ? 'ቁርጠቱ ሲቆም ይጫኑ'
                  : lang === 'om'
                  ? 'Yoo Dhaabbate Tuqaa'
                  : 'Tap to Stop'}
              </span>
            </>
          ) : (
            <>
              <Play className="w-10 h-10 fill-[#881337] text-[#881337] ml-1 mb-1" />
              <span className="text-base sm:text-lg font-black leading-tight">
                {lang === 'am' || lang === 'har'
                  ? 'ምጥ ሲጀምር ይጫኑ'
                  : lang === 'om'
                  ? 'Ciniinsuun Jalqabe'
                  : 'Start Contraction'}
              </span>
              <span className="text-[10px] opacity-80 mt-1">
                {lang === 'am' || lang === 'har' ? 'ጊዜውን ለመለካት' : 'Tap to time'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Optional calm-breathing companion kept separate from clinical timing */}
      <div className="border border-[#FBCFE8] rounded-2xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => {
            setShowBreathing((visible) => !visible);
            setBreathStep(0);
            triggerHaptic('selection');
          }}
          className="w-full px-3 py-2.5 flex items-center justify-between gap-2 text-left"
          aria-expanded={showBreathing}
        >
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </span>
            <span>
              <span className="block text-xs font-black text-[#4A0420]">
                {lang === 'am'
                  ? 'ለእረፍት የመተንፈስ ልምምድ'
                  : lang === 'om'
                  ? 'Qubee Hafuuraaf'
                  : 'Calm breathing'}
              </span>
              <span className="block text-[10px] text-[#783A4E]">
                {lang === 'am'
                  ? 'ነፃ ለማረፍ፣ የጊዜ ቆጣሪውን አይደፍርም'
                  : lang === 'om'
                  ? 'Hafuraa boqochuu; sa’aatii hin mudaas'
                  : 'Optional comfort while you wait'}
              </span>
            </span>
          </span>
          <span className="text-[11px] font-bold text-teal-700">
            {showBreathing
              ? (lang === 'am' ? 'ዝጋ' : lang === 'om' ? 'Cufi' : 'Close')
              : (lang === 'am' ? 'ክፈት' : lang === 'om' ? 'Banami' : 'Open')}
          </span>
        </button>

        {showBreathing && (
          <div className="px-3 pb-3">
            <div className="rounded-xl bg-teal-50 border border-teal-100 py-4 px-3 flex items-center gap-3">
              <div
                className={`w-14 h-14 shrink-0 rounded-full border-4 border-teal-200 bg-white flex items-center justify-center transition-transform duration-1000 ${
                  breathStep < 4 ? 'scale-110' : 'scale-75'
                }`}
                aria-hidden="true"
              >
                <Wind className="w-5 h-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-teal-900">
                  {breathStep < 4
                    ? (lang === 'am' ? 'ቀስ ብለው ውስጥ ይተነፍሱ' : lang === 'om' ? 'Hafuurii afuufi — suuta' : 'Breathe in slowly')
                    : (lang === 'am' ? 'አውጣ  — በቀስታ' : lang === 'om' ? 'Hafuurii baasi — suuta' : 'Breathe out gently')}
                </p>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  {lang === 'am'
                    ? '4 ሰከንድ ወደ ውስጥ፣ 6 ሰከንድ ወደ ውጭ። በምቾትዎ ይሰሩ።'
                    : lang === 'om'
                    ? 'Sek. 4 afuufi, sek. 6 baasii. Akkuma mijataan taphadhaa.'
                    : '4 seconds in, 6 seconds out. Follow only what feels comfortable.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5-1-1 Clinical Triage Status */}
      {is511Labor ? (
        <div className="p-4 bg-red-50 rounded-2xl border-2 border-[#DC2626] text-red-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-sm text-[#DC2626]">
            <AlertCircle className="w-5 h-5 text-[#DC2626] animate-bounce shrink-0" />
            <span>
              {lang === 'am' || lang === 'har'
                ? 'የጊዜ መለኪያ ህክምና ቅድመ-ግምገማ'
                : lang === 'om'
                ? 'Tarkaanfii Ciniinsuu Haala Maamiltootti Qabsa’e'
                : 'Pattern worth calling about'}
            </span>
          </div>
          <p className="text-xs leading-relaxed font-semibold">
            {lang === 'am' || lang === 'har'
              ? 'ይህ በቁርጠት ማቆጠር ላይ የሚገኝ ንድፍ ነው። የህክምና ባለሙያዎ ወይም የእርግዝና ክፍል ደንብን ይከተሉ እና 907 ያነጋግሩ።'
              : lang === 'om'
              ? 'Kun akkaataa lakkooftuu yeroo agarsiisa. Qajeelfama ogeessa fayyaa duukaa bu’aa; yoo daangeffamu 907 bilbilaa.'
              : 'This pattern warrants contacting your maternity unit for guidance. Follow their instructions and call 907 if they advise emergency transport.'}
          </p>
          <button
            type="button"
            onClick={onEmergencyClick}
            className="w-full py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{lang === 'am' || lang === 'har' ? '907 አምቡላንስ ጥራ' : 'Call 907 Ambulance'}</span>
          </button>
        </div>
      ) : history.length >= 2 ? (
        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-[#4A0420] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {lang === 'am' || lang === 'har'
              ? 'ቁርጠቱ ገና መደበኛ አልሆነም (ቅድመ-ምጥ ሊሆን ይችላል)። በግራ ጎንዎ አረፍ ይበሉ።'
              : lang === 'om'
              ? 'Ciniinsuun ammayyuu walirraa hin cinne. Bitaadhaan boqodhaa.'
              : 'Contractions are still irregular (likely false labor). Rest on your left side and stay hydrated.'}
          </span>
        </div>
      ) : null}

      {/* Contraction History Table */}
      {history.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#881337] block">
            {lang === 'am' || lang === 'har' ? 'የቅርብ ጊዜ ቁርጠቶች' : lang === 'om' ? 'Ciniinsuu Dhiyoo' : 'Recent Contractions'}
          </span>
          <div className="divide-y divide-[#FBCFE8] border border-[#FBCFE8] rounded-xl overflow-hidden bg-white">
            {history.map((record, idx) => (
              <div key={record.id} className="p-2.5 px-3 flex items-center justify-between text-xs">
                <span className="font-bold text-[#881337]">#{history.length - idx}</span>
                <span className="font-semibold text-[#4A0420]">
                  {record.durationSeconds}s {lang === 'am' || lang === 'har' ? 'ቆይታ' : 'duration'}
                </span>
                <span className="text-[11px] text-[#783A4E]">
                  {record.intervalMinutes !== null
                    ? `${record.intervalMinutes}m ${lang === 'am' || lang === 'har' ? 'ልዩነት' : 'apart'}`
                    : (lang === 'am' || lang === 'har' ? 'የመጀመሪያ' : 'First')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

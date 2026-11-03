import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  Clock3,
  Droplets,
  Heart,
  HeartPulse,
  Moon,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { AppLanguage } from '../types';

interface PostpartumCareProps {
  lang: AppLanguage;
  onGoHome: () => void;
  onOpenDirectory?: () => void;
}

export const PostpartumCare: React.FC<PostpartumCareProps> = ({
  lang,
  onGoHome,
  onOpenDirectory,
}) => {
  const [restDone, setRestDone] = useState(false);
  const [waterDone, setWaterDone] = useState(false);
  const [feedingSeconds, setFeedingSeconds] = useState(0);
  const [feedingRunning, setFeedingRunning] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!feedingRunning) return;
    const timer = window.setInterval(() => setFeedingSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [feedingRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  const copy = {
    title: lang === 'am' || lang === 'har' ? 'የድህረ ወለድ እንክብካቤ' : lang === 'om' ? 'Kununsa dhalachuu booda' : 'Postpartum Care',
    subtitle: lang === 'am' || lang === 'har' ? 'ለእርስዎም ለህጻንዎም የቀን እንክብካቤ መሣሪያዎች' : lang === 'om' ? 'Meeshaalee kununsa guyyaa siifi daa’imaa keetii' : 'Simple daily care tools for you and your baby',
    back: lang === 'am' || lang === 'har' ? 'ወደ ዋናው ገጽ' : lang === 'om' ? 'Gara fuula duraatti' : 'Back Home',
    facilities: lang === 'am' || lang === 'har' ? 'የጤና ጣቢያዎች' : lang === 'om' ? 'Buufata fayyaa' : 'Health facilities',
  };

  const warningLabels = {
    bleeding: lang === 'am' || lang === 'har' ? 'ከባድ ደም መውጣት' : lang === 'om' ? 'Dhiiga baay’ee dhangala’uu' : 'Heavy bleeding',
    fever: lang === 'am' || lang === 'har' ? 'ትኩሳት ወይም ሽኩንታ' : lang === 'om' ? 'Ho’a ykn hollina' : 'Fever or chills',
    mood: lang === 'am' || lang === 'har' ? 'ከባድ የሆውንጥ ወይም የአስተሳሰብ ለውጥ' : lang === 'om' ? 'Yaaddoo cimaa ykn jijjiirama yaadaa' : 'Severe mood change',
    pain: lang === 'am' || lang === 'har' ? 'ከባድ የጎልበት ወይም ሆድ ህመም' : lang === 'om' ? 'Dhukkuba garaa cimaa' : 'Severe pain',
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="mc-inner-header bg-white border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={onGoHome} className="flex items-center gap-1.5 text-xs font-black text-[#881337] min-w-0">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{copy.back}</span>
          </button>
          {onOpenDirectory && (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="flex items-center gap-1 rounded-full border border-[#FBCFE8] bg-[#FFE4E6] px-3 py-2 text-[11px] font-black text-[#881337] max-w-[55%]"
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{copy.facilities}</span>
            </button>
          )}
        </div>
        <div className="mt-3">
          <h2 className="text-xl font-black text-[#4A0420]">{copy.title}</h2>
          <p className="mt-1 text-xs text-[#783A4E]">{copy.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <section className="rounded-[1.5rem] border border-[#FBCFE8] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#881337]">
            <Clock3 className="w-5 h-5" />
            <h3 className="text-base font-black">
              {lang === 'am' || lang === 'har' ? 'የማጥባት ማቆሚያ' : lang === 'om' ? 'Sa’aatii harma hoosisuu' : 'Feeding timer'}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="font-black tabular-nums text-3xl text-[#4A0420]">{formatTime(feedingSeconds)}</span>
            <button
              type="button"
              onClick={() => setFeedingRunning((value) => !value)}
              className={`min-h-12 rounded-2xl px-4 text-sm font-black text-white ${feedingRunning ? 'bg-[#4A0420]' : 'bg-[#881337]'}`}
            >
              {feedingRunning
                ? lang === 'am' || lang === 'har' ? 'አቁም' : lang === 'om' ? 'Dhaabi' : 'Stop'
                : lang === 'am' || lang === 'har' ? 'ጀምር' : lang === 'om' ? 'Jalqabi' : 'Start'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setFeedingRunning(false); setFeedingSeconds(0); }}
            className="mt-3 flex min-h-11 items-center gap-1.5 text-xs font-black text-[#783A4E]"
          >
            <RotateCcw className="w-4 h-4" />
            {lang === 'am' || lang === 'har' ? 'እንደገና ጀምር' : lang === 'om' ? 'Irra deebi’i' : 'Reset'}
          </button>
        </section>

        <section className="rounded-[1.5rem] border border-[#D8E4DF] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#315B50]">
            <Moon className="w-5 h-5" />
            <h3 className="text-base font-black">
              {lang === 'am' || lang === 'har' ? 'የቀን እንክብካቤ' : lang === 'om' ? 'Goochaa guyyaa' : 'Today’s care'}
            </h3>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              type="button"
              aria-pressed={restDone}
              onClick={() => setRestDone((value) => !value)}
              className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 text-left text-sm font-bold ${restDone ? 'border-[#315B50] bg-[#E4F0EB] text-[#173D29]' : 'border-[#E9D3DA] bg-white text-[#4A0420]'}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${restDone ? 'bg-[#315B50] text-white' : 'bg-[#F8DCE6] text-[#881337]'}`}>
                {restDone ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </span>
              {lang === 'am' || lang === 'har' ? 'የተጠበቀ እረፍት ወስጄአለሁ' : lang === 'om' ? 'Boqonnaa eegaleera' : 'I rested and protected my energy'}
            </button>
            <button
              type="button"
              aria-pressed={waterDone}
              onClick={() => setWaterDone((value) => !value)}
              className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 text-left text-sm font-bold ${waterDone ? 'border-[#315B50] bg-[#E4F0EB] text-[#173D29]' : 'border-[#E9D3DA] bg-white text-[#4A0420]'}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${waterDone ? 'bg-[#315B50] text-white' : 'bg-[#F8DCE6] text-[#881337]'}`}>
                {waterDone ? <Check className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
              </span>
              {lang === 'am' || lang === 'har' ? 'በቂ ውሃ ጠጥቻለሁ' : lang === 'om' ? 'Bishaan ga’a dhugera' : 'I drank enough water'}
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-[1.5rem] border border-[#FBCFE8] bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2 text-[#881337]">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-black">
            {lang === 'am' || lang === 'har' ? 'አስቸኳይ የሆኑ ምልክቶችን ፈትሹ' : lang === 'om' ? 'Mallattoolee hatattamaa qoradhu' : 'Check urgent warning signs'}
          </h3>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(warningLabels).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={selectedWarning === id}
              onClick={() => setSelectedWarning(selectedWarning === id ? null : id)}
              className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-bold ${selectedWarning === id ? 'border-[#D12E1B] bg-[#FDE5E0] text-[#C0301C]' : 'border-[#E9D3DA] bg-white text-[#4A0420]'}`}
            >
              <span>{label}</span>
              <HeartPulse className="w-4 h-4 shrink-0" />
            </button>
          ))}
        </div>
        {selectedWarning && (
          <div className="mt-3 rounded-xl border border-[#D12E1B] bg-[#FDE5E0] p-3 text-sm font-bold text-[#C0301C]">
            {lang === 'am' || lang === 'har'
              ? 'ይህን ምልክት ካስተዋሉ ወዲያውኑ ወደ የጤና ጣቢያ ይሂዱ ወይም 907 ይደውሉ።'
              : lang === 'om'
              ? 'Mallattoo kana yoo hubattee hattattamaan buufata fayyaatti deemi ykn 907 bilbili.'
              : 'If you have this warning sign, go to a health facility or call 907 now.'}
          </div>
        )}
      </section>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  Cigarette,
  HeartHandshake,
  Leaf,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  TimerReset,
  Wine,
} from 'lucide-react';
import { AppLanguage } from '../types';

interface SubstanceUseSupportProps {
  lang: AppLanguage;
  onGoHome: () => void;
  onOpenDirectory?: () => void;
}

export const SubstanceUseSupport: React.FC<SubstanceUseSupportProps> = ({
  lang,
  onGoHome,
  onOpenDirectory,
}) => {
  const [counts, setCounts] = useState({ alcohol: 0, tobacco: 0, khat: 0 });
  const [breathingRunning, setBreathingRunning] = useState(false);
  const [breathingSeconds, setBreathingSeconds] = useState(60);
  const [dailyPlan, setDailyPlan] = useState<string[]>([]);

  useEffect(() => {
    if (!breathingRunning) return;
    if (breathingSeconds <= 0) {
      setBreathingRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setBreathingSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [breathingRunning, breathingSeconds]);

  const copy = {
    en: {
      title: 'Substance & Wellbeing',
      subtitle: 'Private, practical support for safer choices',
      back: 'Back Home',
      facilities: 'Health facilities',
      tracker: 'Today’s exposure check',
      trackerHint: 'Track only if it is safe and comfortable. One tap equals one check-in.',
      alcohol: 'Alcohol',
      tobacco: 'Tobacco / cigarette',
      khat: 'Khat',
      reset: 'Reset today',
      breathing: '1-minute calming pause',
      breathingHint: 'Breathe in gently for 4 seconds, then out for 6 seconds.',
      start: 'Start pause',
      stop: 'Stop pause',
      plan: 'Safer-day plan',
      pregnant: 'Pregnancy: no alcohol, tobacco or khat is the safest choice. Ask a health worker privately before stopping medicines or treatments.',
      eht: 'Ethiopia notes',
      tips: [
        'Avoid alcohol and tobacco entirely while pregnant.',
        'Khat can affect sleep, nutrition, blood pressure and pregnancy care; seek support without shame.',
        'Keep small water and a light snack nearby when cravings arrive.',
        'Call a trusted family member, health worker, or the directory before being alone in a high-risk moment.',
      ],
      help: 'Get help early',
      urgent: 'Seek urgent help for chest pain, fainting, confusion, severe breathing difficulty, seizure, or repeated vomiting.',
      call: 'Call 907',
    },
    am: {
      title: 'የሱስ እና ደህንነት እገዛ',
      subtitle: 'ለደህንነቱ ምርጫዎች ግላዊና ተግባራዊ ድጋፍ',
      back: 'ወደ ዋናው',
      facilities: 'የጤና ጣቢያዎች',
      tracker: 'የዛሬ መጋለጥ ማረጋገጫ',
      trackerHint: 'ደህንነቱ ከሚስማማ ጨዋነት ይመዝግቡ። አንድ ጠቅታ አንድ ማረጋገጫ ነው።',
      alcohol: 'አልኮል',
      tobacco: 'ትምባሆ / ሲጋራ',
      khat: 'ጫት',
      reset: 'የዛሬውን አጽዳ',
      breathing: 'የአንድ ደቂቃ እረፍት',
      breathingHint: 'በቀስታ ለ4 ሰከንድ ይተንፍሱ፣ ለ6 ሰከንድ ይውጡ።',
      start: 'እረፍት ጀምር',
      stop: 'እረፍት አቁም',
      plan: 'ደህንነቱ የተጠበቀ የዛሬ ዕቅድ',
      pregnant: 'እርግዝና: አልኮል፣ ትምባሆ ወይም ጫትን አለመጠቀም የበለጠ ደህንነት ነው። ህክምናን ከመቋረጡ በፊት ከጤና ሰራተኛ ጋር ለብሺት ይነጋገሩ።',
      eht: 'የኢትዮጵያ ማስታወሻዎች',
      tips: ['በእርግዝና ወቅት አልኮልና ትምባሆን ሙሉ በሙሉ ይታቀቡ።', 'ጫት እንቅልፍ፣ ምግብ አወሳሰድ፣ የደም ግፊት እና የእርግዝና እንክብካቤን ሊጎዳ ይችላል።', 'ማባበር ሲጀመር ውሃና ቀላል ምግብ ቅርብ ያድርጉ።', 'ከአደገኛ ሁኔታ በፊት የታመነ ቤተሰብ፣ ወዳጅ ወይም ጤና ሰራተኛ ያግኙ።'],
      help: 'በራሱ የጥበቃ ጥያቄ',
      urgent: 'የደረት ህመም፣ የእዉቀት መቀየር፣ መተንፈስ ችግር፣ ሲናን፣ ወይም ተደጋጋሚ ማስታወስ ካለ በቅርቡ እርዳታ ይፈልጉ።',
      call: '907 ይደውሉ',
    },
    om: {
      title: 'Mirkaneessuu fi Fayyummaa',
      subtitle: 'Gargaarsa dhuunfaa fi hojii barbaachisu',
      back: 'Gara Jalqabaatti',
      facilities: 'Buufata fayyaa',
      tracker: 'Mirkanaa’ina guyyaa har’aa',
      trackerHint: 'Nageenyaan yoo ta’e qofa galmeessi. Tuqni tokko mirkannaa tokko.',
      alcohol: 'Alkoolii',
      tobacco: 'Tamboo',
      khat: 'Caatii',
      reset: 'Guyyaa haaraa',
      breathing: 'Bogonnaa daqiiqaa 1',
      breathingHint: 'Sekondii 4 ittiin siifaa, sekondii 6 baafadhu.',
      start: 'Bogonnaa jalqabi',
      stop: 'Bogonnaa dhaabi',
      plan: 'Karoorrii guyyaa nagaa',
      pregnant: 'Ulfaattaa: alkoolii, tamboo fi caatii hin fayyadamne. Osoo yaala dhorkaan dura ogeessa fayyaa waliin marii.',
      eht: 'Yaadannoo Itoophiyaa',
      tips: ['Ulfa yeroo tokko alkoolii fi tamboo guutummaan guutuutti dhiisi.', 'Caatiin hirriba, nyaata, dhiibbaa dhiigaa fi kununsa ulfaa miidha.', 'Yeroo hawwii dhufe bishaanii fi nyaata salphaa si dhiyeessi.', 'Osoo balaa guddaan hin dhufin maatii amanamaa ykn ogeessa fayyaa bira gaari.'],
      help: 'Yeroo hayyamni hin turin gargaarsa argadhu',
      urgent: 'Dhukkuba garaa, osoo hin beekamne kufuu, hargansuu rakkisaa, walqixa wallaaluu ykn ol akka dabalamuu tasgabbii gargaarsa argadhu.',
      call: '907 bilbilaa',
    },
    har: {
      title: 'አስገዳጅና ደህንነት',
      subtitle: 'ግላዊ እና ተግባራዊ ድጋፍ',
      back: 'ወደ ዋናው',
      facilities: 'የጤና ጣቢያዎች',
      tracker: 'የዛሬ መጋለጥ',
      trackerHint: 'ደህንነቱ ከሚስማማ ጥምር ይመዝግቡ።',
      alcohol: 'አልኮል',
      tobacco: 'ትምባሆ',
      khat: 'ጫት',
      reset: 'የዛሬውን አጽዳ',
      breathing: 'የአንድ ደቂቃ እረፍት',
      breathingHint: 'በቀስታ ለ4 ሰከንድ ይተንፍሱ፣ ለ6 ይውጡ።',
      start: 'ጀምር',
      stop: 'አቁም',
      plan: 'ደህንነቱ የተጠበቀ ዕቅድ',
      pregnant: 'እርግዝና: አልኮል፣ ትምባሆ ወይም ጫትን አለመጠቀም የተሻለ ደህንነት ነው።',
      eht: 'የኢትዮጵያ ማስታወሻዎች',
      tips: ['በእርግዝና ወቅት አልኮልና ትምባሆን ይታቀቡ።', 'ጫት እንቅልፍና ምግብ መበላውን ሊጎዳ ይችላል።', 'ውሃና ቀላል ምግብ ቅርብ ያድርጉ።', 'የታመነ ቤተሰብ ወይም ጤና ሰራተኛ ያግኙ።'],
      help: 'በራሱ የጥበቃ ጥያቄ',
      urgent: 'የደረት ህመም፣ ማስታወስ፣ መተንፈስ ችግር ወይም ተደጋጋሚ ማስታወስ ካለ እርዳታ ይፈልጉ።',
      call: '907 ይደውሉ',
    },
  };
  const t = copy[lang] || copy.en;
  const planOptions = [
    lang === 'en' ? 'Avoid one usual trigger' : lang === 'om' ? 'Adeemsa tokko dhowwii' : lang === 'am' ? 'አንድ ልማዳዊ ቀስቃሽ ይታቀቡ' : 'ቀስቃሽ ይታቀቡ',
    lang === 'en' ? 'Drink water / eat lightly' : lang === 'om' ? 'Bishaan dhugii / salphaan nyaadhu' : lang === 'am' ? 'ውሃ ይጠጡ / ቀላል ይመገቡ' : 'ውሃ ይጠጡ',
    lang === 'en' ? 'Contact a trusted person' : lang === 'om' ? 'Nama amanamaa quunnami' : lang === 'am' ? 'የሚታመን ሰው ያግኙ' : 'የሚታመን ሰው ያግኙ',
  ];
  const togglePlan = (item: string) => setDailyPlan((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]);
  const formatTime = `${Math.floor(breathingSeconds / 60)}:${String(breathingSeconds % 60).padStart(2, '0')}`;

  return (
    <div className="mc-substance-page space-y-4 pb-8">
      <div className="mc-substance-header mc-inner-header bg-white border border-[#B9D8C6] rounded-[2rem] p-4">
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={onGoHome} className="flex items-center gap-1.5 text-xs font-black text-[#315B50] min-w-0">
            <ArrowLeft className="w-4 h-4 shrink-0" /><span>{t.back}</span>
          </button>
          {onOpenDirectory && (
            <button type="button" onClick={onOpenDirectory} className="flex items-center gap-1 rounded-full border border-[#B9D8C6] bg-[#EAF5EF] px-3 py-2 text-[11px] font-black text-[#315B50] max-w-[55%]">
              <Building2 className="w-3.5 h-3.5 shrink-0" /><span>{t.facilities}</span>
            </button>
          )}
        </div>
        <div className="mt-3 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF5EF] text-[#315B50]"><Leaf className="w-5 h-5" /></span>
          <div><h2 className="text-xl font-black text-[#173D29]">{t.title}</h2><p className="mt-1 text-xs text-[#4E655A]">{t.subtitle}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-3">
        <section className="rounded-[1.5rem] border border-[#B9D8C6] bg-white p-4">
          <div className="flex items-center gap-2 text-[#315B50]"><HeartHandshake className="w-5 h-5" /><h3 className="text-base font-black">{t.tracker}</h3></div>
          <p className="mt-1 text-xs leading-relaxed text-[#4E655A]">{t.trackerHint}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              ['alcohol', t.alcohol, Wine],
              ['tobacco', t.tobacco, Cigarette],
              ['khat', t.khat, Leaf],
            ] as const).map(([key, label, Icon]) => (
              <button key={key} type="button" onClick={() => setCounts((value) => ({ ...value, [key]: value[key] + 1 }))} className="mc-substance-counter min-h-[88px] rounded-2xl border border-[#C9DDD1] bg-[#F8FCFA] p-3 text-left">
                <span className="flex items-center justify-between gap-2"><Icon className="w-5 h-5 text-[#315B50]" /><strong className="text-2xl text-[#173D29] tabular-nums">{counts[key]}</strong></span>
                <span className="mt-2 block text-xs font-black text-[#315B50]">{label}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setCounts({ alcohol: 0, tobacco: 0, khat: 0 })} className="mt-3 flex min-h-11 items-center gap-1.5 text-xs font-black text-[#315B50]"><RotateCcw className="w-4 h-4" />{t.reset}</button>
        </section>

        <section className="rounded-[1.5rem] border border-[#B9D8C6] bg-[#F8FCFA] p-4">
          <div className="flex items-center gap-2 text-[#315B50]"><TimerReset className="w-5 h-5" /><h3 className="text-base font-black">{t.breathing}</h3></div>
          <p className="mt-1 text-xs leading-relaxed text-[#4E655A]">{t.breathingHint}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-3xl font-black tabular-nums text-[#173D29]">{formatTime}</span>
            <button type="button" onClick={() => { if (breathingRunning) setBreathingRunning(false); else { if (breathingSeconds === 0) setBreathingSeconds(60); setBreathingRunning(true); } }} className="min-h-12 rounded-2xl bg-[#315B50] px-4 text-sm font-black text-white">
              {breathingRunning ? t.stop : t.start}
            </button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_.75fr] gap-3">
        <section className="rounded-[1.5rem] border border-[#B9D8C6] bg-white p-4">
          <h3 className="text-base font-black text-[#173D29]">{t.plan}</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {planOptions.map((item) => {
              const selected = dailyPlan.includes(item);
              return <button key={item} type="button" aria-pressed={selected} onClick={() => togglePlan(item)} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold ${selected ? 'border-[#315B50] bg-[#EAF5EF] text-[#173D29]' : 'border-[#D8E6DE] bg-white text-[#315B50]'}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-[#315B50] text-white' : 'bg-[#EAF5EF] text-[#315B50]'}`}>{selected ? <Check className="w-4 h-4" /> : <span aria-hidden="true">+</span>}</span><span>{item}</span>
              </button>;
            })}
          </div>
        </section>

        <aside className="rounded-[1.5rem] border border-[#D8C9A9] bg-[#FFFDF7] p-4">
          <h3 className="text-base font-black text-[#315B50]">{t.eht}</h3>
          <ul className="mt-3 space-y-2">{t.tips.map((tip) => <li key={tip} className="flex gap-2 text-xs leading-relaxed text-[#4E655A]"><Check className="mt-0.5 w-3.5 h-3.5 shrink-0 text-[#315B50]" /><span>{tip}</span></li>)}</ul>
        </aside>
      </div>

      <section className="rounded-[1.5rem] border border-[#B9D8C6] bg-[#EAF5EF] p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#315B50]" />
          <div className="min-w-0"><h3 className="text-sm font-black text-[#173D29]">{t.help}</h3><p className="mt-1 text-xs leading-relaxed text-[#315B50]">{t.pregnant}</p><p className="mt-2 text-xs font-bold leading-relaxed text-[#315B50]">{t.urgent}</p></div>
        </div>
        <a href="tel:907" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#315B50] px-4 text-xs font-black text-white"><PhoneCall className="w-4 h-4" />{t.call}</a>
      </section>
    </div>
  );
};

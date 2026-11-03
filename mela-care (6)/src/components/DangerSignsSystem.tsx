import React, { useState } from 'react';
import {
  AppLanguage,
  DangerSign,
  BodyZone,
} from '../types';
import { DANGER_SIGNS } from '../data/maternalData';
import { resolveText } from '../utils/compass';
import { AudioOrb } from './AudioOrb';
import { MedicalBeacon } from './MedicalBeacon';
import { KickTapper } from './KickTapper';
import { BirthKitChecklist } from './BirthKitChecklist';
import { ContractionTimer } from './ContractionTimer';
import { triggerHaptic } from '../utils/telegram';
import {
  AlertCircle,
  PhoneCall,
  Droplet,
  Zap,
  EyeOff,
  Activity,
  AlertTriangle,
  Waves,
  Thermometer,
  Flame,
  HeartPulse,
  Heart,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Building2,
  Send,
  CheckCircle2,
  Timer,
  PackageCheck,
  Clock,
  Eye,
} from 'lucide-react';
import silhouetteMapImg from '../assets/images/maternal_silhouette_map_1793061212776.jpg';
import maternalPreeclampsiaImg from '../assets/images/maternal_preeclampsia_guide_1793105782753.jpg';
import maternalHemorrhageImg from '../assets/images/maternal_hemorrhage_urgent_1793105783358.jpg';

interface DangerSignsSystemProps {
  lang: AppLanguage;
  onGoHome: () => void;
  onOpenDirectory?: () => void;
  initialMode?: 'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test' | 'labor_timer';
}

export const DangerSignsSystem: React.FC<DangerSignsSystemProps> = ({
  lang,
  onGoHome,
  onOpenDirectory,
  initialMode,
}) => {
  // Selected anatomical body zone
  const [activeZone, setActiveZone] = useState<BodyZone>('head_eyes');
  const [activeBeaconSign, setActiveBeaconSign] = useState<DangerSign | null>(null);
  const [isBeaconOpen, setIsBeaconOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test' | 'labor_timer'>(
    initialMode || 'body_map'
  );

  // Edema 5-second Shin Test State
  const [edemaTimer, setEdemaTimer] = useState<number>(0);
  const [isEdemaTesting, setIsEdemaTesting] = useState<boolean>(false);
  const [edemaResult, setEdemaResult] = useState<'normal' | 'edema_detected' | null>(null);

  // SMS Dispatch Alert State
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  // Body zones definition with visual touch coordinates and metadata
  const bodyZoneNodes: {
    id: BodyZone;
    label: { en: string; am: string; om: string; har: string };
    icon: string;
    topPercent: number;
    leftPercent: number;
    urgencyColor: string;
  }[] = [
    {
      id: 'head_eyes',
      label: { en: 'Head & Vision', am: 'ራስ እና እይታ', om: 'Mataa & Ija', har: 'ራስ እና እይታ' },
      icon: '🧠',
      topPercent: 12,
      leftPercent: 44,
      urgencyColor: '#DC2626',
    },
    {
      id: 'face_hands',
      label: { en: 'Face & Hands', am: 'ፊት እና እጅ', om: 'Fuula & Harka', har: 'ፊት እና እጅ' },
      icon: '💧',
      topPercent: 24,
      leftPercent: 50,
      urgencyColor: '#D97706',
    },
    {
      id: 'chest_breath',
      label: { en: 'Chest & Breath', am: 'ደረት እና ትንፋሽ', om: 'Qoma & Hafuura', har: 'ደረት እና ትንፋሽ' },
      icon: '🫁',
      topPercent: 38,
      leftPercent: 49,
      urgencyColor: '#DC2626',
    },
    {
      id: 'womb_belly',
      label: { en: 'Womb & Kicks', am: 'ማህፀን እና ምት', om: 'Garaa & Sochii', har: 'ማህፀን እና ምት' },
      icon: '🤰',
      topPercent: 58,
      leftPercent: 40,
      urgencyColor: '#DC2626',
    },
    {
      id: 'pelvis_waters',
      label: { en: 'Waters & Bleeding', am: 'ፈሳሽ እና ደም', om: 'Dhiiga & Bishaan', har: 'ፈሳሽ እና ደም' },
      icon: '🩸',
      topPercent: 73,
      leftPercent: 48,
      urgencyColor: '#DC2626',
    },
    {
      id: 'whole_body',
      label: { en: 'Fever & Shivering', am: 'ትኩሳት & ብርድ', om: 'Ho’a Qaamaa', har: 'ትኩሳት እና ብርድ' },
      icon: '🌡️',
      topPercent: 88,
      leftPercent: 48,
      urgencyColor: '#D97706',
    },
  ];

  // Danger signs matching active body zone
  const activeSigns = DANGER_SIGNS.filter((sign) => sign.bodyZone === activeZone);

  const handleOpenBeacon = (sign: DangerSign) => {
    triggerHaptic('heavy');
    setActiveBeaconSign(sign);
    setIsBeaconOpen(true);
  };

  const renderZoneIcon = (zone: BodyZone, className = 'w-4 h-4') => {
    if (zone === 'head_eyes') return <Eye className={className} />;
    if (zone === 'face_hands') return <Droplet className={className} />;
    if (zone === 'chest_breath') return <Activity className={className} />;
    if (zone === 'womb_belly') return <HeartPulse className={className} />;
    if (zone === 'pelvis_waters') return <Waves className={className} />;
    return <Thermometer className={className} />;
  };

  // Start 5-second Edema Test
  const startEdemaTest = () => {
    setIsEdemaTesting(true);
    setEdemaResult(null);
    setEdemaTimer(5);

    const interval = setInterval(() => {
      setEdemaTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsEdemaTesting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Dispatch Emergency Alert to HEW / Family via API
  const handleDispatchAlert = (sign: DangerSign) => {
    setIsDispatching(true);
    const buildLocalAlert = () => {
      const title = resolveText(sign.title, lang);
      return lang === 'am' || lang === 'har'
        ? `አደጋ፦ ${title}። ወደ የጤና ጣቢያ ይሂዱ ወይም 907 ይደውሉ። አሁን ያለበትን ቦታ ይንገሩ።`
        : lang === 'om'
        ? `Balaa: ${title}. Gara buufata fayyaatti deemi ykn 907 bilbili. Bakka amma jirtu himi.`
        : `Emergency: ${title}. Go to a health facility or call 907. State your current location.`;
    };

    fetch('/api/prepare-emergency-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dangerSignTitle: resolveText(sign.title, lang),
        severity: sign.severity,
        locationName: 'Kebele Health Post / Home',
        language: lang,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.alertMessage) {
          navigator.clipboard?.writeText(data.alertMessage);
          setDispatchStatus(
            lang === 'am' || lang === 'har'
              ? `የአደጋ ጥሪ ተዘጋጅቷል! ተቀድቷል፦ «${data.alertMessage}»`
              : lang === 'om'
              ? `Ergaan hatattamaa qophaa’ee waraabameera: «${data.alertMessage}»`
              : `Alert message copied to clipboard: «${data.alertMessage}»`
          );
        }
      })
      .catch((err) => {
        console.warn('Emergency message API unavailable on static hosting:', err);
        navigator.clipboard?.writeText(buildLocalAlert());
        setDispatchStatus(
          lang === 'am' || lang === 'har'
            ? 'የአደጋ መልእክት ዝግጁ ሆኗል እና ተቀድቷል። 907 ይደውሉ።'
            : lang === 'om'
            ? 'Ergaan hatattamaa qophaaʼeera, waraabameera. 907 bilbilaa.'
            : 'Emergency message is ready and copied. Call 907 now.'
        );
      })
      .finally(() => setIsDispatching(false));
  };

  const spokenOverview =
    lang === 'am'
      ? 'የእናትየው አካል ዳሰሳ ክፍል ውስጥ ነዎት። በሰውነት ስዕሉ ላይ የተሰማዎትን ክፍል በመንካት የትኛዎቹ ምልክቶች አደገኛ እንደሆኑ እና ወዲያውኑ ምን ማድረግ እንዳለብዎ በድምፅ ያዳምጡ።'
      : lang === 'om'
      ? 'Kutaa qorannoo qaamaa keessa jirtu. Bakka dhukkubbii qaama irratti tuquun mallattoolee balaa fi wanta gochuu qabdan sagaleen dhaggeeffadhaa.'
      : 'You are in the Anatomical Body Triage sanctuary. Touch any highlighted zone on the silhouette to hear clinical danger signs and immediate emergency steps.';

  return (
    <div className="space-y-4 animate-in fade-in pb-8">
      {/* 1. TOP TITLE & MODE SWITCHER */}
      <div className="mc-inner-header bg-white/80 backdrop-blur-md border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-black text-[#881337] hover:text-[#4A0420] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'am' ? 'ወደ ዋናው ገጽ' : lang === 'om' ? 'Gara Fuula Duraatti' : 'Back Home'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="text-[10px] uppercase font-bold tracking-wider text-[#881337] bg-[#FFE4E6] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#FBCFE8]"
              >
                <Building2 className="w-3 h-3 text-[#E11D48]" />
                <span>Hospitals</span>
              </button>
            )}
            <span className="text-[10px] uppercase font-black tracking-widest text-[#991B1B] bg-red-100 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              <span>Emergency Triage</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-[#4A0420] leading-tight">
              {lang === 'am'
                ? 'የሰውነት አደገኛ ምልክቶች ዳሰሳ'
                : lang === 'om'
                ? 'Qorannoo Mallattoolee Balaa Qaamaa'
                : 'Anatomical Body Triage'}
            </h2>
            <p className="text-xs text-[#783A4E]">
              {lang === 'am'
                ? 'የተሰማዎትን የሰውነት ክፍል ነክተው ያዳምጡ'
                : lang === 'om'
                ? 'Bakka dhukkubbii qaamaa tuquun dhaggeeffadhaa'
                : 'Touch any anatomical hotspot to triage'}
            </p>
          </div>

          <a
            href="tel:907"
            className="px-3.5 py-2 rounded-2xl bg-[#DC2626] text-white text-xs font-black flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
            title="Emergency Ambulance Service 907"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>907</span>
          </a>
        </div>

        {/* Pregnancy and danger-sign tools */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setViewMode('body_map')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              viewMode === 'body_map'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <span className="text-sm">🧍‍♀️</span>
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የአካል ዳሰሳ' : lang === 'om' ? 'Qaama' : 'Body Map'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('labor_timer')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              viewMode === 'labor_timer'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#E11D48]" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'ምጥ ቆጣሪ' : lang === 'om' ? 'Lakkoofsa ciniinsuu' : 'Labor Timer'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('kick_counter')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              viewMode === 'kick_counter'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#E11D48]" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የፅንስ ምት' : lang === 'om' ? 'Sochii' : 'Kicks'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('birth_kit')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              viewMode === 'birth_kit'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-[#E11D48]" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የወሊድ ቦርሳ' : lang === 'om' ? 'Boorsaa' : 'Birth Bag'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('edema_test')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              viewMode === 'edema_test'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Timer className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'እብጠት ምልከታ' : lang === 'om' ? 'Dhiita ilaaluu' : 'Swelling Check'}
            </span>
          </button>
        </div>
      </div>

      {/* MODE: 5-1-1 CONTRACTION & LABOR INTERVAL TIMER */}
      {viewMode === 'labor_timer' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <ContractionTimer
            lang={lang}
            onEmergencyClick={() => {
              if (DANGER_SIGNS.length > 0) {
                handleOpenBeacon(DANGER_SIGNS[0]);
              }
            }}
          />
        </div>
      )}

      {/* MODE: BIRTH PREPAREDNESS DELIVERY BAG CHECKLIST */}
      {viewMode === 'birth_kit' && (
        <BirthKitChecklist
          lang={lang}
          onOpenDirectory={onOpenDirectory}
        />
      )}

      {/* 2. MODE: PREECLAMPSIA EDEMA SHIN TEST */}
      {viewMode === 'edema_test' && (
        <div className="bg-white border border-[#FBCFE8] rounded-[2.5rem] p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#9D174D] block">
              {lang === 'am' || lang === 'har'
                ? 'የእግር እብጠት ምልከታ'
                : lang === 'om'
                ? 'Qorannoo Dhiita Miilaa Sekoondii 5'
                : 'Swelling Observation (Not A Diagnosis)'}
            </span>
            <h3 className="text-lg font-black text-[#4A0420]">
              {lang === 'am' || lang === 'har'
                ? 'የእግር እና የፊት እብጠት ምልከታ'
                : lang === 'om'
                ? 'Qorannoo Dhiita Miilaa fi Fuulaa'
                : 'Swelling Observation'}
            </h3>
            <p className="text-xs text-[#783A4E]">
              {lang === 'am' || lang === 'har'
                ? 'ይህ ምርመራ አይደለም። የታየውን እብጠት ብቻ ይመልከቱ እና ከምልከታው ራስዎን አይመዝኑ።'
                : lang === 'om'
                ? 'Kun qorannoo miti. Dhiita miilaa qofaa ilaalaa; bu’aa isaatiif of murteessuu hin yaalin.'
                : 'This is not a diagnostic test. Observe visible swelling only; do not diagnose yourself from this check.'}
            </p>
          </div>

          <div className="py-4 flex flex-col items-center justify-center text-center">
            {isEdemaTesting ? (
              <div className="w-36 h-36 rounded-full bg-amber-500 text-white flex flex-col items-center justify-center shadow-lg animate-pulse">
                <span className="text-4xl font-black">{edemaTimer}</span>
                <span className="text-[10px] uppercase font-bold">
                  {lang === 'am' || lang === 'har' ? 'ጣቱን ይጫኑ...' : lang === 'om' ? 'Dhiibaa qabaa...' : 'Holding thumb...'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEdemaTest}
                className="w-36 h-36 rounded-full bg-[#881337] text-white flex flex-col items-center justify-center shadow-md active:scale-95 transition-all hover:bg-[#701A75]"
              >
                <Timer className="w-10 h-10 mb-1 text-rose-200" />
                <span className="text-xs font-black">
                  {lang === 'am' || lang === 'har' ? 'ጀምር (5 ሰከንድ)' : lang === 'om' ? 'Jalqabaa (Sek. 5)' : 'Start 5s Test'}
                </span>
              </button>
            )}
          </div>

          {!isEdemaTesting && edemaTimer === 0 && (
            <div className="bg-[#FFF5F7] rounded-2xl p-4 border border-[#FBCFE8] space-y-3">
              <span className="text-xs font-bold text-[#4A0420] block">
                {lang === 'am' || lang === 'har'
                  ? 'ጣቱን ሲለቁት ቆዳው ምን ሆነ?'
                  : lang === 'om'
                  ? 'Yoo quba kaastan gogaan maal ta’e?'
                  : 'What happened when you lifted your thumb?'}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEdemaResult('normal')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center break-words ${
                    edemaResult === 'normal'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-[#4A0420] border-[#FBCFE8] hover:bg-emerald-50'
                  }`}
                >
                  {lang === 'am' || lang === 'har' ? 'ወዲያው ተመለሰ (መደበኛ)' : lang === 'om' ? 'Battalatti Deebi’e' : 'Springs back (Normal)'}
                </button>

                <button
                  type="button"
                  onClick={() => setEdemaResult('edema_detected')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center break-words ${
                    edemaResult === 'edema_detected'
                      ? 'bg-[#DC2626] text-white border-[#DC2626]'
                      : 'bg-white text-[#991B1B] border-red-200 hover:bg-red-50'
                  }`}
                >
                  {lang === 'am' || lang === 'har' ? 'ጉድጓድ ሆኖ ቀረ (አደጋ)' : lang === 'om' ? 'Goollee Ta’ee Hafe' : 'Leaves a dent (Warning)'}
                </button>
              </div>

              {edemaResult === 'edema_detected' && (
                <div className="p-3 bg-red-100 rounded-xl border border-red-300 text-xs text-[#991B1B] font-bold space-y-2">
                  <p>
                    {lang === 'am' || lang === 'har'
                      ? '⚠️ የሚታይ እብጠት በእርግዝና ወቅት የሚገኝ የከፍተኛ አደጋ ምልክት ሊሆን ይችላል። ራስዎን አይመዝኑ፤ ዛሬውኑ ክትትል ወይም ጤና ተቋም ይጠይቁ።'
                      : lang === 'om'
                      ? '⚠️ Dhiita mul’atu mallattoo balaa ulfaa yeroo ta’u danda’a. Har’a eegumsa dahuumsa ykn buufata fayyaa gaafadhaa.'
                      : 'Visible swelling can be an important pregnancy warning. Do not diagnose yourself; seek antenatal care or a health facility today.'}
                  </p>
                  <a
                    href="tel:907"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-black shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{lang === 'am' || lang === 'har' ? '907 ደውል' : lang === 'om' ? '907 Bilbilaa' : 'Call 907'}</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. MODE: FETAL KICK RHYTHM SANCTUARY */}
      {viewMode === 'kick_counter' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <KickTapper
            lang={lang}
            onEmergencyClick={() => {
              const reducedSign = DANGER_SIGNS.find((s) => s.id === 'reduced_fetal_movement');
              if (reducedSign) handleOpenBeacon(reducedSign);
            }}
          />
        </div>
      )}

      {/* 4. MODE: INTERACTIVE ANATOMICAL BODY SILHOUETTE (Responsive 2-Column Split on Tablet/PC) */}
      {viewMode === 'body_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column: Silhouette Canvas & Body Hotspots (Sticky on PC) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            {/* Main Visual Silhouette Canvas */}
            <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#881337] to-[#4A0420] p-4 text-white overflow-hidden shadow-lg border border-[#FBCFE8]">
              <div className="mc-silhouette-canvas relative w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden border border-white/20 shadow-inner">
                <img
                  src={silhouetteMapImg}
                  alt="Pregnant Silhouette Medical Anatomy"
                  className="w-full h-full object-contain object-center opacity-90"
                />

                {/* Glowing Interactive Hotspot Rings */}
                {bodyZoneNodes.map((node) => {
                  const isSelected = activeZone === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setActiveZone(node.id)}
                      style={{
                        top: `${node.topPercent}%`,
                        left: `${node.leftPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute z-20 flex items-center justify-center transition-all duration-300 group ${
                        isSelected ? 'scale-125' : 'scale-100 hover:scale-110'
                      }`}
                      title={resolveText(node.label, lang)}
                      aria-label={resolveText(node.label, lang)}
                    >
                      {/* Concentric pulsing aura */}
                      <span
                        className={`absolute w-10 h-10 rounded-full opacity-75 animate-ping ${
                          isSelected ? 'bg-[#E11D48]' : 'bg-white/40'
                        }`}
                      />
                      <span
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border-2 ${
                          isSelected
                            ? 'bg-[#E11D48] text-white border-white scale-110'
                            : 'bg-white text-[#4A0420] border-[#881337]'
                        }`}
                      >
                        {renderZoneIcon(node.id)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick-Access Touch Stones */}
              <div className="pt-3">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {bodyZoneNodes.map((node) => {
                    const isSelected = activeZone === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveZone(node.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 border min-w-0 ${
                          isSelected
                            ? 'bg-[#E11D48] text-white border-white shadow-xs'
                            : 'bg-white/10 text-rose-100 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <span aria-hidden="true">{renderZoneIcon(node.id, 'w-3.5 h-3.5')}</span>
                        <span>{resolveText(node.label, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Zone Spoken Instruction */}
            <AudioOrb spokenText={spokenOverview} tone="URGENT_CALM" lang={lang} />
          </div>

          {/* Right Column: Diagnostic Cards for Selected Body Zone */}
          <div className="lg:col-span-7 space-y-4">
            {/* Status Message if Alert Dispatched */}
            {dispatchStatus && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{dispatchStatus}</span>
              </div>
            )}

            <div className="px-1 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#881337] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
                <span>
                  {lang === 'am' || lang === 'har'
                    ? 'በዚህ የሰውነት ክፍል የሚታዩ አደጋዎች'
                    : lang === 'om'
                    ? 'Balaa Qaama Kana Irratti Mul’atu'
                    : 'Danger Signs in this Zone'}
                </span>
              </span>
              <span className="text-[11px] font-bold text-[#783A4E]">
                {activeSigns.length} {lang === 'am' || lang === 'har' ? 'ምልክቶች' : lang === 'om' ? 'mallattoolee' : 'signs'}
              </span>
            </div>

            {activeSigns.map((sign) => {
              const isEmergency = sign.severity === 'EMERGENCY';
              return (
                <div
                  key={sign.id}
                  className={`rounded-[2rem] p-5 border-2 transition-all shadow-xs space-y-4 ${
                    isEmergency
                      ? 'bg-red-50/90 border-red-300'
                      : 'bg-white border-[#FBCFE8]'
                  }`}
                >
                  {/* Badge & Title */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isEmergency
                            ? 'bg-[#DC2626] text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                        <span>{resolveText(sign.badgeLabel, lang)}</span>
                      </span>

                      <h3 className="text-lg font-black text-[#4A0420] leading-snug break-words">
                        {resolveText(sign.title, lang)}
                      </h3>
                    </div>

                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isEmergency
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-[#FFE4E6] text-[#881337]'
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Contextual Clinical Art Illustration */}
                  {(sign.bodyZone === 'head_eyes' || sign.bodyZone === 'face_hands' || sign.bodyZone === 'pelvis_waters') && (
                    <div className="relative h-32 sm:h-36 w-full rounded-2xl overflow-hidden border border-[#FBCFE8] shadow-2xs">
                      <img
                        src={
                          sign.bodyZone === 'pelvis_waters'
                            ? maternalHemorrhageImg
                            : maternalPreeclampsiaImg
                        }
                        alt="Clinical Illustration"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-bold flex items-center justify-between">
                        <span className="truncate pr-2">
                          {sign.bodyZone === 'pelvis_waters'
                            ? (lang === 'am' || lang === 'har' ? 'የደም መፍሰስ ድንገተኛ አደጋ' : lang === 'om' ? 'Balaa Dhiiga Dhangala’uu' : 'Emergency Bleeding Sign')
                            : (lang === 'am' || lang === 'har' ? 'የደም ግፊት እና የራስ ምታት ማስጠንቀቂያ' : lang === 'om' ? 'Akeekkachiisa Dhiibbaa Dhiigaa' : 'Preeclampsia Warning Sign')}
                        </span>
                        <span className="text-[10px] bg-red-600/90 px-2 py-0.5 rounded-full font-black shrink-0">
                          {isEmergency ? 'Critical' : 'Urgent'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#4A0420] leading-relaxed">
                    {resolveText(sign.description, lang)}
                  </p>

                  {/* Spoken Audio Player */}
                  <AudioOrb
                    spokenText={resolveText(sign.spokenAudio, lang)}
                    tone={isEmergency ? 'URGENT_CALM' : 'CALM_GUIDE'}
                    lang={lang}
                  />

                  {/* Immediate Action Steps */}
                  <div className="bg-white/80 rounded-2xl p-3 border border-[#FBCFE8] space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#881337] block">
                      {lang === 'am' || lang === 'har'
                        ? 'ወዲያውኑ የሚወሰድ እርምጃ'
                        : lang === 'om'
                        ? 'Tarkaanfii Hatattamaa'
                        : 'Immediate Action Instruction'}
                    </span>
                    <p className="text-xs font-bold text-[#4A0420] leading-relaxed">
                      {resolveText(sign.actionInstruction, lang)}
                    </p>
                  </div>

                  {/* Action Buttons: Show Flashcard Beacon & Direct Call */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenBeacon(sign)}
                      className="py-3 px-3.5 rounded-2xl bg-[#881337] hover:bg-[#701A75] active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all text-center break-words min-w-0"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                      <span className="leading-tight">
                        {lang === 'am' || lang === 'har'
                          ? 'ለሹፌር / ነርስ አሳይ'
                          : lang === 'om'
                          ? 'Shofeera / Ogeessatti Agarsiisi'
                          : 'Show Flashcard'}
                      </span>
                    </button>

                    <a
                      href="tel:907"
                      className="py-3 px-3.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all text-center break-words min-w-0"
                    >
                      <PhoneCall className="w-4 h-4 shrink-0" />
                      <span className="leading-tight">
                        {lang === 'am' || lang === 'har'
                          ? '907 አምቡላንስ ደውል'
                          : lang === 'om'
                          ? 'Ambulaansii 907 Bilbilaa'
                          : 'Call 907 Ambulance'}
                      </span>
                    </a>
                  </div>

                  {/* Dispatch SMS to HEW / Family Button */}
                  <button
                    type="button"
                    onClick={() => handleDispatchAlert(sign)}
                    disabled={isDispatching}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-[#881337] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all text-center break-words min-w-0"
                  >
                    <Send className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                    <span className="leading-tight">
                      {lang === 'am' || lang === 'har'
                        ? 'የአደጋ መልዕክት ለጤና ኤክስቴንሽን ሰራተኛ አዘጋጅ'
                        : lang === 'om'
                        ? 'Ergaa Hatattamaa Ogeessaaf Qopheessi'
                        : 'Compose Emergency Alert to HEW'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency Flashcard Modal (Medical Beacon) */}
      {isBeaconOpen && (
        <MedicalBeacon
          isOpen={isBeaconOpen}
          onClose={() => setIsBeaconOpen(false)}
          lang={lang}
          customSign={activeBeaconSign}
        />
      )}
    </div>
  );
};

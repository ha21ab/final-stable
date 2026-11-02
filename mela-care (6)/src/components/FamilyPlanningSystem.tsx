import React, { useState } from 'react';
import {
  AppLanguage,
  ContraceptiveMethod,
  MythFact,
} from '../types';
import {
  CONTRACEPTIVE_METHODS,
  MYTHS_AND_FACTS,
} from '../data/maternalData';
import { resolveText } from '../utils/compass';
import { AudioOrb } from './AudioOrb';
import { MissedDoseNavigator } from './MissedDoseNavigator';
import {
  Heart,
  Sparkles,
  Shield,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  RotateCw,
  EyeOff,
  Baby,
  Smile,
  Copy,
  Share2,
  Compass,
  Building2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import midwifeCareImg from '../assets/images/ethiopian_midwife_care_1793061212461.jpg';
import contraceptiveCounselingImg from '../assets/images/contraceptive_counseling_1793105801588.jpg';
import { triggerHaptic } from '../utils/telegram';

interface FamilyPlanningSystemProps {
  lang: AppLanguage;
  onGoHome: () => void;
  onOpenDirectory?: () => void;
}

export const FamilyPlanningSystem: React.FC<FamilyPlanningSystemProps> = ({
  lang,
  onGoHome,
  onOpenDirectory,
}) => {
  // Task navigation: duration, method advisor, missed dose, common myths, and reminders.
  const [activeSection, setActiveSection] = useState<'horizon' | 'compass' | 'myths' | 'lunar' | 'missed_dose'>('horizon');

  // Selected time horizon method
  const [selectedMethodId, setSelectedMethodId] = useState<string>('depo_provera_injection');

  // Flipped state for myth cards
  const [flippedMyths, setFlippedMyths] = useState<Record<string, boolean>>({});

  // 3-Step Decision Compass State
  const [compassStep, setCompassStep] = useState<number>(1);
  const [compassDuration, setCompassDuration] = useState<'short' | 'medium' | 'long' | null>(null);
  const [compassBreastfeeding, setCompassBreastfeeding] = useState<boolean | null>(null);
  const [compassPrivacy, setCompassPrivacy] = useState<boolean | null>(null);

  // Lunar tracker state
  const [injectionDate, setInjectionDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [copiedReminder, setCopiedReminder] = useState<boolean>(false);

  // Time horizons for the ribbon
  const horizonRibbon: {
    id: string;
    icon: string;
    timeLabel: { en: string; am: string; om: string; har: string };
    shortLabel: { en: string; am: string; om: string; har: string };
  }[] = [
    {
      id: 'depo_provera_injection',
      icon: '💧',
      timeLabel: { en: '3 Months', am: '3 ወር', om: 'Ji’a 3', har: '3 ወር' },
      shortLabel: { en: '3-Month Depo', am: 'የ3 ወር መርፌ', om: 'Lilmoo Ji’a 3', har: 'መርፌ' },
    },
    {
      id: 'implant_jadelle_implanon',
      icon: '🌿',
      timeLabel: { en: '3-5 Years', am: '3-5 ዓመት', om: 'Waggaa 3-5', har: '3-5 ዓመት' },
      shortLabel: { en: 'Arm Implant', am: 'የክንድ መከላከያ', om: 'Muka Irree', har: 'የክንድ' },
    },
    {
      id: 'copper_iud_loop',
      icon: '⚓',
      timeLabel: { en: '10-12 Years', am: '10 ዓመት', om: 'Waggaa 10', har: '10 ዓመት' },
      shortLabel: { en: 'Copper Loop (IUD)', am: 'የማህፀን ሉፕ', om: 'Luuppii Gadameessaa', har: 'ሉፕ' },
    },
    {
      id: 'emergency_contraceptive_pill',
      icon: '⚡',
      timeLabel: { en: '72 Hours', am: '72 ሰዓት', om: 'Sa’aatii 72', har: '72 ሰዓት' },
      shortLabel: { en: 'Emergency Post-Pill', am: 'የድንገተኛ እንክብል', om: 'Qoricha Hatattamaa', har: 'ድንገተኛ' },
    },
    {
      id: 'oral_contraceptive_pills',
      icon: '🛡️',
      timeLabel: { en: 'Daily', am: 'ዕለታዊ', om: 'Guyyaa Guyyaa', har: 'ዕለታዊ' },
      shortLabel: { en: 'Daily Pills', am: 'የየዕለት ኪኒን', om: 'Kiniinii Guyyaa', har: 'ኪኒን' },
    },
    {
      id: 'lam_breastfeeding_natural',
      icon: '🤱',
      timeLabel: { en: '6 Months', am: '6 ወር', om: 'Ji’a 6', har: '6 ወር' },
      shortLabel: { en: 'Nursing Shield (LAM)', am: 'የተፈጥሮ ጡት ማጥባት', om: 'Harma Hoosisuu', har: 'ጡት ማጥባት' },
    },
  ];

  const currentMethod =
    CONTRACEPTIVE_METHODS.find((m) => m.id === selectedMethodId) || CONTRACEPTIVE_METHODS[0];

  const toggleMythFlip = (id: string) => {
    setFlippedMyths((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute recommendation from Decision Compass
  const getCompassRecommendation = (): ContraceptiveMethod => {
    if (compassDuration === 'long') {
      return (
        CONTRACEPTIVE_METHODS.find((m) => m.id === 'copper_iud_loop') ||
        CONTRACEPTIVE_METHODS[0]
      );
    }
    if (compassDuration === 'medium') {
      return (
        CONTRACEPTIVE_METHODS.find((m) => m.id === 'implant_jadelle_implanon') ||
        CONTRACEPTIVE_METHODS[0]
      );
    }
    // Short term or default
    if (compassPrivacy) {
      return (
        CONTRACEPTIVE_METHODS.find((m) => m.id === 'depo_provera_injection') ||
        CONTRACEPTIVE_METHODS[0]
      );
    }
    return (
      CONTRACEPTIVE_METHODS.find((m) => m.id === 'depo_provera_injection') ||
      CONTRACEPTIVE_METHODS[0]
    );
  };

  // Lunar return date calculation (Depo = 12 weeks = 84 days; grace window = 98 days)
  const calculateReturnDates = () => {
    const base = new Date(injectionDate);
    if (isNaN(base.getTime())) return null;

    const dueDate = new Date(base);
    dueDate.setDate(dueDate.getDate() + 84); // 12 weeks

    const graceDate = new Date(base);
    graceDate.setDate(graceDate.getDate() + 98); // 14 weeks grace limit

    return {
      dueFormatted: dueDate.toLocaleDateString(
        lang === 'am' ? 'am-ET' : 'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      ),
      graceFormatted: graceDate.toLocaleDateString(
        lang === 'am' ? 'am-ET' : 'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      ),
      daysLeft: Math.max(
        0,
        Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      ),
    };
  };

  const lunarData = calculateReturnDates();

  const handleCopyReminder = () => {
    if (!lunarData) return;
    const text =
      lang === 'am'
        ? `የመላ ኬር ማስታወሻ፦ የሚቀጥለው የ3 ወር የወሊድ መከላከያ መርፌ ቀንዎት ${lunarData.dueFormatted} ነው። እስከ ${lunarData.graceFormatted} ድረስ በጤና ጣቢያ መውሰድ ይችላሉ።`
        : `Mela Care Reminder: Next 3-month Depo injection is due on ${lunarData.dueFormatted} (Safety window until ${lunarData.graceFormatted}).`;

    navigator.clipboard?.writeText(text);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-8">
      {/* 1. TOP HEADER & SECTION CONTROLLER */}
      <div className="bg-white/80 backdrop-blur-md border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-3">
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
                <span>{lang === 'om' ? 'Eeggannoo' : lang === 'am' || lang === 'har' ? 'የጤና ጣቢያ' : 'Health facilities'}</span>
              </button>
            )}
            <span className="text-[10px] uppercase font-black tracking-widest text-[#881337] bg-[#FFE4E6] px-3 py-1 rounded-full flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#E11D48]" />
              <span>{lang === 'om' ? 'Iccitii' : lang === 'am' || lang === 'har' ? 'ግላዊ ምርጫ' : 'Private Choice'}</span>
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-[#4A0420] leading-tight">
            {lang === 'am'
              ? 'የቤተሰብ ምጣኔ'
              : lang === 'om'
              ? 'Karoora Maatii'
              : lang === 'har'
              ? 'የቤተሰብ ምጣኔ'
              : 'Family Planning'}
          </h2>
          <p className="text-xs text-[#783A4E]">
            {lang === 'am'
              ? 'ለእርስዎ እና ለህፃንዎ ተስማሚ የወሊድ መቆጣጠሪያ ምርጫ'
              : lang === 'om'
              ? 'Mala ulfa ittisuu mijataa fi iccitii qabu'
              : 'Private birth spacing aligned with Ethiopian health clinics'}
          </p>
        </div>

        {/* Family planning tools */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveSection('horizon')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              activeSection === 'horizon'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Clock className="w-4 h-4 mb-0.5 text-rose-300" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የጊዜ አማራጮች' : lang === 'om' ? 'Yeroo' : 'Explore methods'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('compass')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              activeSection === 'compass'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'ምርጫ አጋዥ' : lang === 'om' ? 'Gorsa' : 'Advisor'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('missed_dose')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              activeSection === 'missed_dose'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <AlertCircle className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'ቀን ሲያልፍ' : lang === 'om' ? 'Irraanfannaa' : 'Missed Dose'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('myths')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              activeSection === 'myths'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የተለመዱ እምነቶች' : lang === 'om' ? 'Dhugaa & Sobaa' : 'Common facts'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('lunar')}
            className={`py-2.5 px-1.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center border transition-all active:scale-95 text-center break-words min-w-0 ${
              activeSection === 'lunar'
                ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5 text-rose-300" />
            <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5">
              {lang === 'am' || lang === 'har' ? 'የመርፌ ቀን' : lang === 'om' ? 'Guyyaa Lilmoo' : 'Refill'}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: THE TACTILE HORIZON RIBBON (Responsive 2-Column Split on Tablet/PC) */}
      {activeSection === 'horizon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column: Visual Hero Banner & Duration Dial (Sticky on PC) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            {/* Visual Hero Banner with Cultural Contraceptive Counseling Art */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#881337] to-[#4A0420] text-white shadow-lg border border-[#FBCFE8]/30">
              <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                <img
                  src={contraceptiveCounselingImg}
                  alt="Ethiopian Contraceptive Counseling"
                  className="w-full h-full object-cover object-center brightness-95 hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A0420] via-[#4A0420]/30 to-transparent" />
                <div className="absolute top-3 right-3 bg-[#881337]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-rose-200 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-current" />
                  <span>{lang === 'am' || lang === 'har' ? 'ምስጢራዊ ምርጫ' : lang === 'om' ? 'Filannoo Iccitii' : 'Private & Informed Choice'}</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 -mt-6 relative z-10 space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {lang === 'am' || lang === 'har' ? 'ለጤናዎ እና ለቤተሰብዎ አግባብነት ያለው የወሊድ መቆጣጠሪያ አማራጭ' : lang === 'om' ? 'Mala ulfa ittisuu fayyaa fi maatii keessaniif mijatu' : 'Choose a contraceptive option for your health and family'}
                </h3>
                <p className="text-xs text-rose-100 font-medium leading-relaxed">
                  {lang === 'am' || lang === 'har'
                    ? 'በጤና ጣቢያዎች እና በጤና ኤክስቴንሽን ሰራተኞች በነጻ የሚሰጡ ዘመናዊ የቤተሰብ ምጣኔ አማራጮች።'
                    : lang === 'om'
                    ? 'Mala ulfa ittisuu ammayyaa buufata fayyaa fi ekisteenshinii fayyaatti bilisaan kennaman.'
                    : 'Free, voluntary modern contraceptive methods available at Ethiopian public health centers.'}
                </p>
              </div>
            </div>

            {/* Horizon Selection Ribbon */}
            <div className="bg-white border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#881337] px-1">
                <span>
                  {lang === 'am' || lang === 'har'
                    ? 'የሚፈልጉትን የቆይታ ጊዜ ይጫኑ'
                    : lang === 'om'
                    ? 'Yeroo Barbaaddan Filadhaa'
                    : 'Select How Long You Want To Space'}
                </span>
                <span className="text-[10px] text-[#783A4E] font-medium">
                  {horizonRibbon.length} {lang === 'am' || lang === 'har' ? 'አማራጮች' : lang === 'om' ? 'filannoowwan' : 'choices'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-1">
                {horizonRibbon.map((item) => {
                  const isSelected = selectedMethodId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMethodId(item.id)}
                      className={`min-w-0 py-3 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border ${
                        isSelected
                          ? 'bg-[#881337] text-white border-[#881337] shadow-md scale-105'
                          : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
                      }`}
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-xs font-black">{resolveText(item.timeLabel, lang)}</span>
                      <span
                        className={`text-[9px] mt-0.5 truncate max-w-[85px] ${
                          isSelected ? 'text-rose-200' : 'text-[#783A4E]'
                        }`}
                      >
                        {resolveText(item.shortLabel, lang)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spoken Companion Audio */}
            <AudioOrb spokenText={resolveText(currentMethod.spokenAudio, lang)} tone="CALM_GUIDE" lang={lang} />
          </div>

          {/* Right Column: Master Method Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-[2.5rem] bg-white border-2 border-[#FBCFE8] p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFE4E6] text-[#881337] text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3 h-3 text-[#E11D48] shrink-0" />
                    <span>{resolveText(currentMethod.duration, lang)}</span>
                  </span>

                  <h3 className="text-xl font-black text-[#4A0420] leading-snug break-words">
                    {resolveText(currentMethod.name, lang)}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#FBCFE8] text-[#881337] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                  {currentMethod.effectiveness}
                </div>
              </div>

              {/* Method summary */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#FFF5F7] rounded-2xl p-3 border border-[#FBCFE8] flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#881337] flex items-center justify-center shrink-0 shadow-2xs">
                    <EyeOff className="w-4 h-4 text-[#E11D48]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#783A4E] block truncate">
                      {lang === 'am' || lang === 'har' ? 'የምስጢር ደረጃ' : lang === 'om' ? 'Sadarkaa Iccitii' : 'Privacy Level'}
                    </span>
                    <span className="text-xs font-black text-[#4A0420] block truncate">
                      {currentMethod.privacyLevel === 'high'
                        ? lang === 'am' || lang === 'har' ? '100% ምስጢራዊ' : lang === 'om' ? '100% Iccitii' : '100% Invisible'
                        : lang === 'am' || lang === 'har' ? 'የተጠበቀ ምስጢር' : lang === 'om' ? 'Eegamaa' : 'Discreet'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FFF5F7] rounded-2xl p-3 border border-[#FBCFE8] flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#881337] flex items-center justify-center shrink-0 shadow-2xs">
                    <Baby className="w-4 h-4 text-[#E11D48]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#783A4E] block truncate">
                      {lang === 'am' || lang === 'har' ? 'ጡት ማጥባት' : lang === 'om' ? 'Harma Hoosisuu' : 'Breastfeeding'}
                    </span>
                    <span className="text-xs font-black text-[#4A0420] block truncate">
                      {currentMethod.breastfeedingSafe
                        ? lang === 'am' || lang === 'har' ? 'ፍጹም ተስማሚ' : lang === 'om' ? 'Mijataa' : 'Safe'
                        : lang === 'am' || lang === 'har' ? 'ከ6 ሳምንት በኋላ' : lang === 'om' ? 'Torban 6 Booda' : 'After 6 wks'}
                    </span>
                  </div>
                </div>
              </div>


            {/* How It Works & What To Expect */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#881337] block">
                  {lang === 'am' ? 'እንዴት ይሰራል?' : lang === 'om' ? 'Akkamitti Hojjata?' : 'How It Protects You'}
                </span>
                <p className="text-xs sm:text-sm text-[#4A0420] leading-relaxed">
                  {resolveText(currentMethod.howItWorks, lang)}
                </p>
              </div>

              <div className="bg-[#FFE4E6]/50 rounded-2xl p-3.5 border border-[#FBCFE8] space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#9D174D] flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>
                    {lang === 'am'
                      ? 'የወር አበባ እና የሰውነት ለውጥ (አያስፈራዎትም)'
                      : lang === 'om'
                      ? 'Jijjiirama Laguu (Hin Sodaatinaa)'
                      : 'Menstrual & Body Experience (Safe)'}
                  </span>
                </span>
                <p className="text-xs text-[#4A0420] leading-relaxed">
                  {resolveText(currentMethod.sideEffects, lang)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#881337] block">
                  {lang === 'am'
                    ? 'ሲቆም ልጅ የመውለድ ሁኔታ'
                    : lang === 'om'
                    ? 'Yoo Dhaabdan Dhaluu'
                    : 'Return to Fertility'}
                </span>
                <p className="text-xs sm:text-sm text-[#4A0420] leading-relaxed font-bold">
                  {resolveText(currentMethod.returnToFertility, lang)}
                </p>
              </div>

              <div className="bg-[#FFF5F7] rounded-2xl p-3 border border-[#FBCFE8] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#783A4E] block">
                    {lang === 'am' ? 'በጤና ጣቢያ የሚሰጠው አገልግሎት' : 'Health Center Administration'}
                  </span>
                  {onOpenDirectory && (
                    <button
                      type="button"
                      onClick={onOpenDirectory}
                      className="text-[10px] font-black text-[#881337] underline flex items-center gap-1"
                    >
                      <Building2 className="w-3 h-3 text-[#E11D48]" />
                      <span>{lang === 'om' ? 'Buufata barbaadi' : lang === 'am' || lang === 'har' ? 'ጤና ጣቢያ ፈልግ' : 'Find a health facility'}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#4A0420] leading-relaxed">
                  {resolveText(currentMethod.clinicGuidance, lang)}
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 3-STEP METHOD DECISION COMPASS */}
      {activeSection === 'compass' && (
        <div className="bg-white border border-[#FBCFE8] rounded-[2.5rem] p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#9D174D] block">
              {lang === 'am' || lang === 'har'
                ? 'ለእርስዎ ተስማሚውን ዘዴ ይምረጡ'
                : lang === 'om'
                ? 'Mala Isiniif Mijataa Filadhaa'
                : 'Personalized Method Advisor'}
            </span>
            <h3 className="text-lg font-black text-[#4A0420]">
              {lang === 'am' || lang === 'har'
                ? 'በ3 ቀላል ጥያቄዎች የሚስማማዎትን ይወቁ'
                : lang === 'om'
                ? 'Gaaffilee 3n Mala Isiniif Ta’u Baraa'
                : 'Find Your Ideal Method in 3 Steps'}
            </h3>
            <p className="text-xs text-[#783A4E]">
              {lang === 'am' || lang === 'har'
                ? 'የማንም ጫና ሳይኖርበት፤ ለጤናዎ እና ለኑሮዎ የሚሆነውን ይወቁ'
                : lang === 'om'
                ? 'Dhiibbaa tokko malee; fayyaa fi jireenya keessaniif kan ta’u'
                : 'This is a discussion guide, not a prescription. A health worker must review medical history and eligibility.'}
            </p>
          </div>

          {/* Step 1: Duration */}
          {compassStep === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <span className="text-xs font-black text-[#881337] block">
                {lang === 'am' || lang === 'har'
                  ? '1. ለምን ያህል ጊዜ ማረፍ ይፈልጋሉ?'
                  : lang === 'om'
                  ? '1. Yeroo hammamiif da’umsa tursiisuu barbaaddu?'
                  : '1. How long do you wish to wait?'}
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompassDuration('short');
                    setCompassStep(2);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-left active:scale-[0.99] transition-all min-w-0"
                >
                  <span className="text-sm font-black text-[#4A0420] block leading-tight break-words">
                    {lang === 'am' || lang === 'har'
                      ? 'የአጭር ጊዜ (ለጥቂት ወራት ወይም 1 ዓመት)'
                      : lang === 'om'
                      ? 'Yeroo Gabaabaa (Ji’oottan muraasa hanga waggaa 1)'
                      : 'Short-term (Few months to 1 year)'}
                  </span>
                  <span className="text-xs text-[#783A4E] block mt-0.5">
                    {lang === 'am' || lang === 'har'
                      ? 'በፍጥነት ማርገዝ ለሚፈልጉ'
                      : lang === 'om'
                      ? 'Dafanii deebi’anii da’uuf'
                      : 'Quick return to fertility'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCompassDuration('medium');
                    setCompassStep(2);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-left active:scale-[0.99] transition-all min-w-0"
                >
                  <span className="text-sm font-black text-[#4A0420] block leading-tight break-words">
                    {lang === 'am' || lang === 'har'
                      ? 'የመካከለኛ ጊዜ (ለ3 እስከ 5 ዓመታት)'
                      : lang === 'om'
                      ? 'Yeroo Giddugaleessaa (Waggaa 3 hanga 5)'
                      : 'Medium-term (3 to 5 years)'}
                  </span>
                  <span className="text-xs text-[#783A4E] block mt-0.5">
                    {lang === 'am' || lang === 'har'
                      ? 'ልጅ እስኪያድግ ድረስ በነፃነት ለማረፍ'
                      : lang === 'om'
                      ? 'Daa’imni hanga guddatutti boqachuuf'
                      : 'Spaced until child reaches school age'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCompassDuration('long');
                    setCompassStep(2);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-left active:scale-[0.99] transition-all min-w-0"
                >
                  <span className="text-sm font-black text-[#4A0420] block leading-tight break-words">
                    {lang === 'am' || lang === 'har'
                      ? 'የረጅም ጊዜ (ለ10 ዓመት ወይም ከዚያ በላይ)'
                      : lang === 'om'
                      ? 'Yeroo Dheeraa (Waggaa 10 fi isaa ol)'
                      : 'Long-term (10+ years)'}
                  </span>
                  <span className="text-xs text-[#783A4E] block mt-0.5">
                    {lang === 'am' || lang === 'har'
                      ? 'ያለ ሆርሞን ለረጅም አመት የሚያገለግል'
                      : lang === 'om'
                      ? 'Hoormoonii malee tajaajilu'
                      : 'Hormone-free long-term security'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Breastfeeding */}
          {compassStep === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <span className="text-xs font-black text-[#881337] block">
                {lang === 'am' || lang === 'har'
                  ? '2. በአሁኑ ሰዓት ጡት እያጠቡ ነው?'
                  : lang === 'om'
                  ? '2. Yeroo ammaa harma hoosisaa jirtuu?'
                  : '2. Are you currently breastfeeding?'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompassBreastfeeding(true);
                    setCompassStep(3);
                  }}
                  className="p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-center active:scale-95 transition-all min-w-0 break-words"
                >
                  <span className="text-2xl mb-1 block">🤱</span>
                  <span className="text-xs font-black text-[#4A0420] block leading-tight">
                    {lang === 'am' || lang === 'har' ? 'አዎ ጡት አጠባለሁ' : lang === 'om' ? 'Eeyyee, Hoosisa' : 'Yes, Nursing Baby'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCompassBreastfeeding(false);
                    setCompassStep(3);
                  }}
                  className="p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-center active:scale-95 transition-all min-w-0 break-words"
                >
                  <span className="text-2xl mb-1 block">🌿</span>
                  <span className="text-xs font-black text-[#4A0420] block leading-tight">
                    {lang === 'am' || lang === 'har' ? 'አላጠባም' : lang === 'om' ? 'Lakki, Hin Hoosisu' : 'Not Breastfeeding'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {compassStep === 3 && (
            <div className="space-y-3 animate-in fade-in">
              <span className="text-xs font-black text-[#881337] block">
                {lang === 'am' || lang === 'har'
                  ? '3. ማንም ሰው እንዳያውቅብዎ 100% በሚስጥር መሆን አለበት?'
                  : lang === 'om'
                  ? '3. Namni akka hin beekne 100% iccitii ta’uu qabaa?'
                  : '3. Do you need 100% discreet privacy?'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompassPrivacy(true);
                    setCompassStep(4);
                  }}
                  className="p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-center active:scale-95 transition-all min-w-0 break-words"
                >
                  <span className="text-2xl mb-1 block">🤫</span>
                  <span className="text-xs font-black text-[#4A0420] block leading-tight">
                    {lang === 'am' || lang === 'har' ? 'አዎ፣ ማንም እንዳያውቅ' : lang === 'om' ? 'Eeyyee, Iccitii' : 'Yes, 100% Secret'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCompassPrivacy(false);
                    setCompassStep(4);
                  }}
                  className="p-4 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-center active:scale-95 transition-all min-w-0 break-words"
                >
                  <span className="text-2xl mb-1 block">🤝</span>
                  <span className="text-xs font-black text-[#4A0420] block leading-tight">
                    {lang === 'am' || lang === 'har' ? 'ግልፅ ነው' : lang === 'om' ? 'Rakkoo Hin Qabu' : 'Open / Supported'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Compass Completed Recommendation */}
          {compassStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              {(() => {
                const rec = getCompassRecommendation();
                return (
                  <div className="rounded-[2rem] bg-gradient-to-b from-[#881337] to-[#4A0420] text-white p-5 space-y-3 shadow-md">
                    <span className="text-[10px] uppercase font-black tracking-widest text-rose-200 block">
                      {lang === 'am' || lang === 'har'
                        ? 'ለእርስዎ ተመራጭ ዘዴ'
                        : lang === 'om'
                        ? 'Mala Isiniif Filatame'
                        : 'Method To Discuss'}
                    </span>
                    <h4 className="text-xl font-black text-white">
                      {resolveText(rec.name, lang)}
                    </h4>
                    <p className="text-xs text-rose-100 leading-relaxed">
                      {resolveText(rec.shortDesc, lang)}
                    </p>
                    <p className="text-xs text-amber-100 leading-relaxed border-t border-white/15 pt-3">
                      {lang === 'am'
                        ? 'ይህ ምክር ብቻ ነው። ትክክለኛ የወሊድ መቆጣጠሪያ የጤና ባለሙያ ካገናዘበ በኋላ ይሰጣል።'
                        : lang === 'om'
                        ? 'Kun gorsa qofaa dha. Mala sirrii ta’e ogeessa fayyaa seenaa fayyaa fi haala fayyaa ilaalchisee murteessu qaba.'
                        : lang === 'har'
                        ? 'ይህ ምክር ብቻ ነው። ትክክለኛ የወሊድ መቆጣጠሪያ የጤና ባለሙያ ካገናዘበ በኋላ ይሰጣል።'
                        : 'For discussion only. A qualified health worker should confirm eligibility and suitability before use.'}
                    </p>

                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethodId(rec.id);
                          setActiveSection('horizon');
                        }}
                        className="py-2.5 px-4 rounded-xl bg-white text-[#881337] font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95"
                      >
                        <span>
                          {lang === 'am' || lang === 'har' ? 'ዝርዝሩን ይመልከቱ' : lang === 'om' ? 'Guutuu Ilaalaa' : 'View Full Guide'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCompassStep(1)}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        {lang === 'am' || lang === 'har' ? 'እንደገና ጀምር' : lang === 'om' ? 'Haaraa Jalqabaa' : 'Restart'}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: THE 3D FLIPPING MYTH HEARTH (Responsive Multi-Column Grid) */}
      {activeSection === 'myths' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#9D174D] block">
              {lang === 'am' || lang === 'har'
                ? 'እውነት እና የተሳሳተ ወሬ'
                : lang === 'om'
                ? 'Dhugaa fi Soba Hawaasaa'
                : 'Medical Truth vs Community Myths'}
            </span>
            <h3 className="text-lg font-black text-[#4A0420]">
              {lang === 'am' || lang === 'har'
                ? 'በወሊድ መቆጣጠሪያ ዙሪያ የሚነገሩ የተሳሳቱ ወሬዎች'
                : lang === 'om'
                ? 'Sobaafi Dhugaa Karoora Maatii'
                : 'Contraceptive Facts vs Myths'}
            </h3>
            <p className="text-xs text-[#783A4E]">
              {lang === 'am' || lang === 'har'
                ? 'ወሬውን ለመገልበጥ እና እውነታውን ለማየት ካርዱን ይጫኑ'
                : lang === 'om'
                ? 'Kardii tuquun dhugaa jiru bari'
                : 'Tap any card to flip and discover the medical truth'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MYTHS_AND_FACTS.map((mf) => {
              const isFlipped = !!flippedMyths[mf.id];
              return (
                <div
                  key={mf.id}
                  onClick={() => toggleMythFlip(mf.id)}
                  className={`cursor-pointer rounded-[2rem] p-5 border-2 transition-all duration-300 shadow-xs space-y-3 flex flex-col justify-between ${
                    isFlipped
                      ? 'bg-[#881337] text-white border-[#881337]'
                      : 'bg-white border-[#FBCFE8] hover:border-[#881337]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isFlipped
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isFlipped
                        ? lang === 'am' || lang === 'har' ? 'እውነታ ✓' : lang === 'om' ? 'Dhugaa ✓' : 'Medical Truth ✓'
                        : lang === 'am' || lang === 'har' ? 'የተሳሳተ ወሬ ✗' : lang === 'om' ? 'Soba ✗' : 'Community Myth ✗'}
                    </span>

                    <span className="text-xs font-bold flex items-center gap-1 opacity-80 shrink-0">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>
                        {isFlipped
                          ? lang === 'am' || lang === 'har' ? 'መልሰው ይግለጡ' : lang === 'om' ? 'Deebisaa' : 'Flip Back'
                          : lang === 'am' || lang === 'har' ? 'ለመገልበጥ ይጫኑ' : lang === 'om' ? 'Garagalchaa' : 'Tap to Flip'}
                      </span>
                    </span>
                  </div>

                  {isFlipped ? (
                    <div className="space-y-2 animate-in fade-in flex-1">
                      <h4 className="text-base font-black text-white leading-snug break-words">
                        {resolveText(mf.fact, lang)}
                      </h4>
                      <div className="pt-1">
                        <AudioOrb spokenText={resolveText(mf.spokenAudio, lang)} tone="CALM_GUIDE" lang={lang} compact />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 flex-1">
                      <span className="text-xs font-bold text-[#783A4E] block">
                        {resolveText(mf.topic, lang)}
                      </span>
                      <h4 className="text-base font-black text-[#4A0420] leading-snug break-words">
                        "{resolveText(mf.myth, lang)}"
                      </h4>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: THE LUNAR REFILL & CLINIC APPOINTMENT MOON */}
      {activeSection === 'lunar' && (
        <div className="bg-white border border-[#FBCFE8] rounded-[2rem] p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#9D174D] block">
              {lang === 'am' || lang === 'har'
                ? 'የመርፌ እና ክኒን መቁጠሪያ'
                : lang === 'om'
                ? 'Lakkooftuu Guyyaa Lilmoo'
                : 'Injection & Refill Tracker'}
            </span>
            <h3 className="text-lg font-black text-[#4A0420]">
              {lang === 'am' || lang === 'har'
                ? 'የሚቀጥለው የመርፌ ወይም ክሊኒክ ቀንዎት'
                : lang === 'om'
                ? 'Guyyaa Lilmoo Ykn Buufata Fayyaa'
                : 'Next Refill Date Countdown'}
            </h3>
            <p className="text-xs text-[#783A4E]">
              {lang === 'am' || lang === 'har'
                ? 'የመጨረሻውን የ3 ወር መርፌ የወሰዱበትን ቀን ይምረጡ'
                : lang === 'om'
                ? 'Guyyaa lilmoo ji’a 3 isa dhumaa fudhattan filadhaa'
                : 'Select the date you received your last 3-month injection'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#881337] block">
              {lang === 'am' || lang === 'har' ? 'የወሰዱበት ቀን' : lang === 'om' ? 'Guyyaa Fudhattan' : 'Date of Last Injection'}
            </label>
            <input
              type="date"
              value={injectionDate}
              onChange={(e) => setInjectionDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FBCFE8] text-sm font-bold text-[#4A0420] focus:outline-none focus:ring-2 focus:ring-[#881337]"
            />
          </div>

          {lunarData && (
            <div className="rounded-[2rem] bg-gradient-to-b from-[#881337] to-[#4A0420] text-white p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-rose-200 block">
                    {lang === 'am' || lang === 'har' ? 'ቀጣይ የቀጠሮ ቀን (12 ሳምንታት)' : lang === 'om' ? 'Guyyaa Beellamaa (Torban 12)' : 'Target Due Date (12 Weeks)'}
                  </span>
                  <span className="text-2xl font-black text-white">
                    {lunarData.dueFormatted}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-base font-black text-rose-200">
                    {lunarData.daysLeft}
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter text-white/80">
                    {lang === 'am' || lang === 'har' ? 'ቀናት' : lang === 'om' ? 'Guyyoota' : 'Days Left'}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-xs text-rose-100 leading-relaxed">
                <span className="font-bold text-white block mb-0.5">
                  {lang === 'am' || lang === 'har'
                    ? 'የ2 ሳምንት የደህንነት ማራዘሚያ ጊዜ'
                    : lang === 'om'
                    ? 'Yeroo Eeggannoo Torban 2'
                    : '2-Week Safety Grace Window'}
                </span>
                {lang === 'am' || lang === 'har'
                  ? `በቀጠሮው ቀን ባይመችዎት እንኳ እስከ ${lunarData.graceFormatted} ድረስ በጤና ጣቢያ መውሰድ ይችላሉ።`
                  : lang === 'om'
                  ? `Guyyaa sana yoo hin dandeenye hanga ${lunarData.graceFormatted} buufatatti fudhachuu dandeessu.`
                  : `If you cannot make the exact date, you remain safely protected until ${lunarData.graceFormatted}.`}
              </div>

              <button
                type="button"
                onClick={handleCopyReminder}
                className="w-full py-3 px-4 rounded-2xl bg-white text-[#881337] hover:bg-[#FFF0F3] active:scale-95 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all text-center break-words min-w-0"
              >
                {copiedReminder ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === 'am' || lang === 'har' ? 'ተቀድቷል!' : lang === 'om' ? 'Waraabameera!' : 'Copied to Clipboard!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#E11D48] shrink-0" />
                    <span>
                      {lang === 'am' || lang === 'har'
                        ? 'ቀኑን ወደ መልዕክት ቅዳ'
                        : lang === 'om'
                        ? 'Beellama Waraabbadhaa'
                        : 'Copy Reminder for SMS/Telegram'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: CLINICAL MISSED DOSE & LATE SHOT NAVIGATOR */}
      {activeSection === 'missed_dose' && (
        <MissedDoseNavigator
          lang={lang}
          onOpenDirectory={onOpenDirectory}
        />
      )}
    </div>
  );
};

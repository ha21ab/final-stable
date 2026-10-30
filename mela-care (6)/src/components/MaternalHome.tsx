import React from 'react';
import {
  AppLanguage,
  ActiveServiceCategory,
} from '../types';
import { AudioOrb } from './AudioOrb';
import { PWAInstallButton } from './PWAInstallButton';
import { triggerHaptic } from '../utils/telegram';
import {
  AlertTriangle,
  Heart,
  Volume2,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  PhoneCall,
  Activity,
  UserCheck,
  CheckCircle2,
  Calendar,
  PackageCheck,
} from 'lucide-react';
import maternalHeroImg from '../assets/images/ethiopian_maternal_hero_1793061211046.jpg';
import midwifeCareImg from '../assets/images/ethiopian_midwife_care_1793061212461.jpg';
import silhouetteMapImg from '../assets/images/maternal_silhouette_map_1793061212776.jpg';
import birthKitImg from '../assets/images/ethiopian_birth_delivery_kit_1793105802113.jpg';

interface MaternalHomeProps {
  lang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onSelectCategory: (
    category: ActiveServiceCategory,
    initialMode?: 'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test'
  ) => void;
  onEmergencyTrigger: () => void;
  onOpenDirectory: () => void;
}

export const MaternalHome: React.FC<MaternalHomeProps> = ({
  lang,
  onSelectLanguage,
  onSelectCategory,
  onEmergencyTrigger,
  onOpenDirectory,
}) => {
  const languages: {
    code: AppLanguage;
    label: string;
    native: string;
    isSlot?: boolean;
    greeting: string;
  }[] = [
    {
      code: 'am',
      label: 'Amharic',
      native: 'አማርኛ',
      greeting: 'እንኳን ደህና መጡ እህቴ። የእርግዝና አደገኛ ምልክቶችን ወይም የቤተሰብ ምጣኔን ይምረጡ።',
    },
    {
      code: 'om',
      label: 'Afaan Oromo',
      native: 'Afaan Oromoo',
      greeting: 'Baga nagaan dhuftan obboleettii koo. Mallattoolee balaa ulfaa ykn karoora maatii filadhaa.',
    },
    {
      code: 'en',
      label: 'English',
      native: 'English',
      greeting: 'Welcome sister. Choose what you need help with: Pregnancy Danger Signs or Family Planning.',
    },
    {
      code: 'har',
      label: 'Harari',
      native: 'ጌይ ሲናን',
      greeting: 'እንኳን ደህና መጡ እህቴ። የእርግዝና አደገኛ ምልክቶችን ወይም የቤተሰብ ምጣኔን ይምረጡ።',
    },
  ];

  const welcomeSpokenText =
    lang === 'am'
      ? 'እንኳን ወደ መላ ኬር በደህና መጡ እህቴ። ይህ የእናቶች እና የቤተሰብ ደህንነት መመሪያ ነው። ከታች ያሉትን ሁለት በሮች ይመልከቱ፦ የመጀመሪያው የእርግዝና አደገኛ ምልክቶችን በሰውነትዎ ላይ ነክተው የሚፈትሹበት ነው፤ ሁለተኛው ደግሞ ለእርስዎ ተስማሚ የወሊድ መቆጣጠሪያን በምስጢር የሚመርጡበት ነው።'
      : lang === 'om'
      ? 'Baga gara Mela Care nagaan dhuftan obboleettii koo. Balbaloowwan lamaan armaan gadii ilaalaa: Inni duraa mallattoolee balaa ulfaa qaama keessan irratti tuquun kan qoratan yoo ta’u, inni lammaffaan karoora maatii iccitii keessaniif ta’udha.'
      : 'Welcome to Mela Care sister. Explore the two maternal sanctuaries below: The first lets you touch body zones to triage pregnancy danger signs; the second offers private, personalized family planning guidance.';

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      {/* 1. FLOATING VOCAL LANGUAGE PEBBLES (Tactile, River-Stone Form) */}
      <section className="bg-white/80 backdrop-blur-md border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#881337] px-1 gap-2 flex-wrap sm:flex-nowrap">
          <span className="flex items-center gap-1.5 min-w-0">
            <Volume2 className="w-4 h-4 text-[#E11D48] animate-pulse shrink-0" />
            <span className="truncate">
              {lang === 'am' || lang === 'har'
                ? 'ቋንቋዎን ይምረጡ (ድምፅ ይናገራል)'
                : lang === 'om'
                ? 'Afaan Filadhaa (Sagaleen Dubbata)'
                : 'Choose Spoken Language'}
            </span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton lang={lang} variant="pill" />
          </div>
        </div>

        {/* Organic Tactile Language Stones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {languages.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onSelectLanguage(item.code);
                }}
                className={`relative py-3 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border ${
                  isSelected
                    ? 'bg-[#881337] text-white border-[#881337] shadow-md shadow-[#881337]/20 scale-[1.02]'
                    : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
                )}
                <span className="text-sm sm:text-base font-black tracking-tight">
                  {item.native}
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-medium ${
                    isSelected ? 'text-rose-200' : 'text-[#783A4E]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. CINEMATIC MATERNAL HERO SANCTUARY */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#881337] to-[#4A0420] text-white shadow-xl shadow-[#881337]/15">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={maternalHeroImg}
            alt="Ethiopian Mother and Newborn"
            className="w-full h-full object-cover object-top opacity-85 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A0420] via-[#4A0420]/60 to-transparent" />
          <div className="absolute top-3 right-3 bg-[#881337]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-rose-200 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#E11D48]" />
            <span>Maternal Companion</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5 -mt-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {lang === 'am'
                ? 'የእናት እና የልጅ ደህንነት መመሪያ'
                : lang === 'om'
                ? 'Qajeelfama Fayyaa Haadha fi Daa’imaa'
                : 'Maternal Life & Health Companion'}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200 leading-relaxed font-normal">
              {lang === 'am'
                ? 'በኢትዮጵያ የጤና ጥበቃ መመሪያዎች መሰረት የተዘጋጀ፤ የድምፅ እና የምልክት እርዳታ።'
                : lang === 'om'
                ? 'Akka qajeelfama Ministeera Fayyaa Itoophiyaatti kan qophaa’e; deeggarsa sagalee fi mallattootiin.'
                : 'Aligned with Ethiopian Ministry of Health clinical protocols with audio-first sisterly guidance.'}
            </p>
          </div>

          {/* Master Voice Greeting Bar */}
          <div className="w-full min-w-0">
            <AudioOrb spokenText={welcomeSpokenText} tone="CALM_GUIDE" lang={lang} />
          </div>
        </div>
      </section>

      {/* 3. THE TWO DEDICATED SCULPTURAL PORTALS (Strictly Danger Signs vs Family Planning) */}
      <section className="space-y-4">
        <div className="px-1 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#881337] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            {lang === 'am' || lang === 'har'
              ? 'አገልግሎት ይምረጡ'
              : lang === 'om'
              ? 'Tajaajila Filadhaa'
              : 'Select A Service Portal'}
          </span>
          <span className="text-[11px] text-[#783A4E] font-medium bg-white px-2.5 py-0.5 rounded-full border border-[#FBCFE8]">
            {lang === 'am' || lang === 'har' ? 'የተለየ' : lang === 'om' ? 'Qophaa’aa' : 'Focused'}
          </span>
        </div>

        {/* 2-Column Responsive Grid on Tablet and Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* PORTAL 1: PREGNANCY DANGER SIGNS & ANATOMICAL BODY TRIAGE */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectCategory('danger_signs')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectCategory('danger_signs');
            }}
            className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-white border-2 border-[#FBCFE8] hover:border-[#881337] p-5 shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.99] text-left flex flex-col justify-between"
          >
            {/* Subtle gradient glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-red-100/60 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Silhouette Image Thumbnail Preview */}
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden border border-red-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={silhouetteMapImg}
                  alt="Anatomical Silhouette"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-[#DC2626] border-2 border-white animate-pulse" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-[#991B1B] text-[10px] font-black uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>
                    {lang === 'am' || lang === 'har'
                      ? 'አስቸኳይ ምርመራ'
                      : lang === 'om'
                      ? 'Qorannoo Hatattamaa'
                      : 'Emergency Triage'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#4A0420] group-hover:text-[#881337] transition-colors leading-tight">
                  {lang === 'am' || lang === 'har'
                    ? 'የእርግዝና አደገኛ ምልክቶች እና የአካል ዳሰሳ'
                    : lang === 'om'
                    ? 'Mallattoolee Balaa Ulfaa fi Qaama'
                    : 'Pregnancy Danger Signs & Body Triage'}
                </h3>

                <p className="text-xs text-[#783A4E] leading-relaxed line-clamp-2">
                  {lang === 'am' || lang === 'har'
                    ? 'የህመም ቦታዎችን በመንካት ያዳምጡ፦ ራስ ምታት፣ የደም መፍሰስ፣ የፅንስ እንቅስቃሴ እና ከፍተኛ ትኩሳት።'
                    : lang === 'om'
                    ? 'Mallattoolee akka dhiigaa, bowwoo cimaa, sochiin mucaa hir’achuu qaama keessan irratti tuquun dhaggeeffadhaa.'
                    : 'Interactive anatomical touch map for bleeding, severe headaches, stopped kicks, and preeclampsia.'}
                </p>

                {/* Dynamically Localized Body Touch Nodes Badge */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#881337] border border-[#FBCFE8]">
                    {lang === 'am' || lang === 'har' ? '🧠 ራስ & እይታ' : lang === 'om' ? '🧠 Mataa & Ija' : '🧠 Head & Vision'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-[#991B1B] border border-red-200">
                    {lang === 'am' || lang === 'har' ? '🩸 ደም መፍሰስ' : lang === 'om' ? '🩸 Dhiiga' : '🩸 Bleeding'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#881337] border border-[#FBCFE8]">
                    {lang === 'am' || lang === 'har' ? '🤰 የፅንስ ምት' : lang === 'om' ? '🤰 Sochii Mucaa' : '🤰 Fetal Kicks'}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[#FBCFE8]/60">
              <span className="text-xs font-bold text-[#881337] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>{lang === 'am' || lang === 'har' ? 'ጀምር' : lang === 'om' ? 'Jalqabaa' : 'Explore'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* PORTAL 2: FAMILY PLANNING & CONTRACEPTIVE HORIZON */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectCategory('family_planning')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectCategory('family_planning');
            }}
            className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-white border-2 border-[#FBCFE8] hover:border-[#881337] p-5 shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.99] text-left flex flex-col justify-between"
          >
            {/* Subtle gradient glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-rose-100/70 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Midwife Care Image Thumbnail Preview */}
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden border border-rose-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={midwifeCareImg}
                  alt="Ethiopian Midwife Care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-[#E11D48] border-2 border-white" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#881337] text-[10px] font-black uppercase tracking-wider">
                  <Heart className="w-3 h-3 text-[#E11D48] shrink-0" />
                  <span>
                    {lang === 'am' || lang === 'har'
                      ? 'የህይወት ምጣኔ'
                      : lang === 'om'
                      ? 'Karoora Maatii'
                      : 'Family Planning'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#4A0420] group-hover:text-[#881337] transition-colors leading-tight">
                  {lang === 'am' || lang === 'har'
                    ? 'የቤተሰብ ምጣኔ እና የወሊድ መቆጣጠሪያ'
                    : lang === 'om'
                    ? 'Karoora Maatii fi Mala Ulfa Ittisuu'
                    : 'Contraceptive Horizon & Myth Hearth'}
                </h3>

                <p className="text-xs text-[#783A4E] leading-relaxed line-clamp-2">
                  {lang === 'am' || lang === 'har'
                    ? 'የጊዜ አድማስ መመሪያ፦ የ3 ወር መርፌ፣ የ3-5 ዓመት ክንድ መከላከያ፣ የ10 ዓመት ሉፕ እና የተሳሳቱ ወሬዎች እውነታ።'
                    : lang === 'om'
                    ? 'Lilmoo ji’a 3, muka irree waggaa 3-5, luuppii waggaa 10 fi dhugaa soba hawaasaa saaxilu.'
                    : 'Explore by duration: 3-month Depo, 3-5 year implants, 10-year IUD, and community myth-busting.'}
                </p>

                {/* Dynamically Localized Horizon Timing Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#881337] border border-[#FBCFE8]">
                    {lang === 'am' || lang === 'har' ? '💧 3 ወር (መርፌ)' : lang === 'om' ? '💧 Ji’a 3 (Lilmoo)' : '💧 3-Month Depo'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#881337] border border-[#FBCFE8]">
                    {lang === 'am' || lang === 'har' ? '🌿 3-5 ዓመት (ክንድ)' : lang === 'om' ? '🌿 Waggaa 3-5 (Irree)' : '🌿 3-5 Years (Implant)'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#881337] border border-[#FBCFE8]">
                    {lang === 'am' || lang === 'har' ? '⚓ 10 ዓመት (ሉፕ)' : lang === 'om' ? '⚓ Waggaa 10 (Luuppii)' : '⚓ 10-Year (IUD)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[#FBCFE8]/60">
              <span className="text-xs font-bold text-[#881337] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>{lang === 'am' || lang === 'har' ? 'ምረጥ' : lang === 'om' ? 'Filadhaa' : 'Choose'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* FEATURED MATERNAL TOOL: BIRTH DELIVERY BAG CHECKLIST */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectCategory('danger_signs', 'birth_kit')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectCategory('danger_signs', 'birth_kit');
          }}
          className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-rose-50 to-[#FFF0F3] border-2 border-[#FBCFE8] hover:border-[#881337] p-5 shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.99] text-left"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden border border-rose-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={birthKitImg}
                  alt="Birth Delivery Preparedness Kit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-[#881337] text-white text-[9px] px-1.5 py-0.5 rounded-md font-black">
                  7 Items
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-[#881337] text-[10px] font-black uppercase tracking-wider">
                  <PackageCheck className="w-3 h-3 text-[#E11D48] shrink-0" />
                  <span>
                    {lang === 'am' || lang === 'har' ? 'የወሊድ ዝግጅት' : lang === 'om' ? 'Qophii Deessummaa' : 'Delivery Readiness'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#4A0420] group-hover:text-[#881337] transition-colors leading-tight">
                  {lang === 'am' || lang === 'har'
                    ? 'የወሊድ ዝግጅት ቦርሳ (7 የህይወት አድን ቁሳቁሶች)'
                    : lang === 'om'
                    ? 'Boorsaa Qophii Deessummaa (Meeshaalee 7)'
                    : 'Birth Preparedness Kit (7 Lifesaving Essentials)'}
                </h3>

                <p className="text-xs text-[#783A4E] leading-relaxed line-clamp-2">
                  {lang === 'am' || lang === 'har'
                    ? 'ምጥ ከመጀመሩ በፊት ንጹህ ምላጭ፣ ጨርቅ፣ ሳሙና፣ የትራንስፖርት ገንዘብ እና የደም ለጋሾችን በድምፅ አዳምጠው ያዘጋጁ።'
                    : lang === 'om'
                    ? 'Haadduu qulqulluu, uffata, saamunaa, maallaqa geejjibaa fi dhiiga arjoomtota qopheessaa.'
                    : 'Clean razor, cord ties, baby blanket, emergency transport fund & blood donors checklist.'}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#FBCFE8]/60 shrink-0">
              <span className="text-xs font-bold text-[#881337] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>{lang === 'am' || lang === 'har' ? 'ቦርሳውን ፈትሽ' : lang === 'om' ? 'Boorsaa Qoradhaa' : 'Check Bag'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOSPITAL & AMBULANCE DISPATCH DOCK (Balanced 2-Column Grid on Tablet/PC) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onOpenDirectory}
          className="w-full bg-white border border-[#FBCFE8] hover:border-[#881337] rounded-[2rem] p-4 flex items-center justify-between gap-3 shadow-xs transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#881337] flex items-center justify-center shrink-0 border border-[#FBCFE8]">
              <span className="text-xl">🏥</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block truncate">
                {lang === 'am' || lang === 'har' ? 'ሆስፒታሎች & ክሊኒኮች' : lang === 'om' ? 'Hospitaalota fi Buufataalee' : 'Hospitals & Clinics'}
              </span>
              <span className="text-sm font-black text-[#4A0420] block truncate">
                {lang === 'am' || lang === 'har'
                  ? 'የእናቶች ሆስፒታሎች ማውጫ'
                  : lang === 'om'
                  ? 'Galmee Hospitaalota Haadholii'
                  : 'Maternity Hospitals Directory'}
              </span>
              <span className="text-[11px] text-[#783A4E] block truncate">
                {lang === 'am' || lang === 'har'
                  ? 'አዲስ አበባ፣ ኦሮሚያ፣ ሐረሪ፣ አማራ፣ ድሬዳዋ'
                  : lang === 'om'
                  ? 'Finfinnee, Oromiyaa, Hararii, Amaara, Dirre Dawaa'
                  : 'Addis Ababa, Oromia, Harari, Amhara, Dire Dawa'}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#881337] shrink-0" />
        </button>

        <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#991B1B] block truncate">
                {lang === 'am' || lang === 'har'
                  ? 'የነጻ አምቡላንስ ጥሪ'
                  : lang === 'om'
                  ? 'Waamicha Ambulaansii Bilisaa'
                  : 'National Free Ambulance'}
              </span>
              <span className="text-sm font-black text-[#991B1B] block">
                {lang === 'am' || lang === 'har' ? '907 አስቸኳይ መስመር' : lang === 'om' ? 'Sarara Hatattamaa 907' : '907 Emergency Hotline'}
              </span>
              <span className="text-[11px] text-[#783A4E] block truncate">
                {lang === 'am' || lang === 'har'
                  ? 'በማንኛውም ስልክ ያለ ክፍያ በቀጥታ ይደውሉ'
                  : lang === 'om'
                  ? 'Bilbila kamiyyuu irraa bilisaan bilbilaa'
                  : 'Free 24/7 National Dispatch across Ethiopia'}
              </span>
            </div>
          </div>

          <a
            href="tel:907"
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{lang === 'am' || lang === 'har' ? '907 ደውል' : lang === 'om' ? '907 Bilbilaa' : 'Call 907'}</span>
          </a>
        </div>
      </section>
    </div>
  );
};



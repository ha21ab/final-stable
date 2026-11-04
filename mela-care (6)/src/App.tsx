/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppLanguage,
  ActiveServiceCategory,
} from './types';
import { MaternalHome } from './components/MaternalHome';
import { DangerSignsSystem } from './components/DangerSignsSystem';
import { FamilyPlanningSystem } from './components/FamilyPlanningSystem';
import { MedicalBeacon } from './components/MedicalBeacon';
import { DiscreetMask } from './components/DiscreetMask';
import { FacilityDirectory } from './components/FacilityDirectory';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PostpartumCare } from './components/PostpartumCare';
import { SubstanceUseSupport } from './components/SubstanceUseSupport';
import { audioEngine } from './utils/audio';
import { initTelegramMiniApp, setupTelegramBackButton, isTelegramMiniApp } from './utils/telegram';
import {
  ArrowLeft,
  AlertCircle,
  Home,
  Volume2,
  VolumeX,
  EyeOff,
  Leaf,
  Building2,
  Info,
  ShieldCheck,
  WifiOff,
  Code2,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('mela-care-language');
    return saved === 'am' || saved === 'om' || saved === 'en' || saved === 'har' ? saved : 'am';
  });
  const [activeCategory, setActiveCategory] = useState<ActiveServiceCategory>(null);
  const [isBeaconOpen, setIsBeaconOpen] = useState<boolean>(false);
  const [isMaskOpen, setIsMaskOpen] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [dangerSignsInitialMode, setDangerSignsInitialMode] = useState<
    'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test' | 'labor_timer'
  >('body_map');

  // Telegram WebApp Initialization
  useEffect(() => {
    initTelegramMiniApp();
  }, []);

  // Telegram Native Back Button Integration
  useEffect(() => {
    if (activeCategory !== null) {
      const cleanup = setupTelegramBackButton(() => {
        handleGoHome();
      });
      return cleanup;
    }
  }, [activeCategory]);

  useEffect(() => {
    const unsub = audioEngine.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
    return () => unsub();
  }, []);

  const handleSelectLang = (newLang: AppLanguage) => {
    audioEngine.stop();
    setLang(newLang);
    localStorage.setItem('mela-care-language', newLang);
  };

  const handleSelectCategory = (
    category: ActiveServiceCategory,
    initialMode?: 'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test' | 'labor_timer'
  ) => {
    audioEngine.stop();
    if (initialMode) {
      setDangerSignsInitialMode(initialMode);
    } else {
      setDangerSignsInitialMode('body_map');
    }
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    audioEngine.stop();
    setActiveCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmergencyTrigger = () => {
    audioEngine.stop();
    setIsBeaconOpen(true);
  };

  return (
    <div className="mc-app min-h-screen w-full overflow-x-hidden bg-[#FCFAF8] text-slate-900 flex flex-col font-sans selection:bg-[#FBCFE8]">
      {/* Discreet Mask Disguise (Toggled in emergency on shared phone) */}
      <DiscreetMask
        isOpen={isMaskOpen}
        onExit={() => setIsMaskOpen(false)}
        lang={lang}
      />

      {/* Top Persistent App Crown */}
      <header className="mc-topbar sticky top-0 z-40 bg-[#6E1E3A] text-white px-3 sm:px-4 py-2.5 sm:py-3 shadow-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {activeCategory !== null && (
            <button
              type="button"
              onClick={handleGoHome}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white flex items-center justify-center mr-0.5"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={handleGoHome}
            className="cursor-pointer flex items-center gap-2.5 min-w-0"
          >
            <img
              src={`${import.meta.env.BASE_URL}mela-mark.png`}
              alt=""
              className="h-9 w-9 rounded-lg bg-white object-contain p-0.5 shadow-xs"
            />
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight block leading-tight truncate max-w-[132px] sm:max-w-none">
                {lang === 'am' || lang === 'har' ? 'መላ ኬር' : 'Mela Care'}
              </span>
              <span className="hidden sm:block text-[10px] text-rose-200 leading-tight font-medium">
                {lang === 'am' || lang === 'har'
                  ? 'የእናቶች እና የስነ-ተዋልዶ ጤና ስርዓት'
                  : lang === 'om'
                  ? 'Sirna Fayyaa Haadholii fi Karoora Maatii'
                  : 'Maternal & Reproductive System'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: PWA Install, Mask, Directory, 907 Call & Urgent Beacon */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* In-App PWA Install Trigger */}
          <div>
            <PWAInstallButton lang={lang} variant="header" />
          </div>

          {/* Quick Privacy Disguise Shield */}
          <button
            type="button"
            onClick={() => setIsMaskOpen(true)}
            className="hidden sm:inline-flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            title={lang === 'am' || lang === 'har' ? 'የሚስጥር መሸፈኛ' : lang === 'om' ? 'Haguuggi Iccitii' : 'Discreet Mask'}
            aria-label="Discreet disguise screen"
          >
            <EyeOff className="w-4 h-4 text-rose-200" />
          </button>

          {/* Persistent emergency action */}
          <button
            type="button"
            onClick={handleEmergencyTrigger}
            className="min-h-11 sm:min-h-0 px-3 py-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#D12E1B] hover:bg-[#B42314] active:scale-95 text-white font-black text-xs flex items-center gap-1 shrink-0 border border-[#EFAE9F] shadow-sm"
            aria-label="Open emergency SOS"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{lang === 'am' || lang === 'har' ? 'አደጋ 907' : lang === 'om' ? 'Balaa 907' : 'SOS 907'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Renders ONE category at a time */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-3 sm:p-5 lg:p-6 flex flex-col justify-start relative">
        {/* Offline Network Toast Banner */}
        <OfflineIndicator lang={lang} />
        {activeCategory === null ? (
          /* FIRST SCREEN: Tactile Language Selection & The 2 Service Portals */
          <MaternalHome
            lang={lang}
            onSelectLanguage={handleSelectLang}
            onSelectCategory={handleSelectCategory}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
          />
        ) : activeCategory === 'danger_signs' ? (
          /* FOCUSED VIEW 1: PREGNANCY DANGER SIGNS & EMERGENCY SYSTEM */
          <div className="mc-page-screen space-y-4">
            <div className="mc-page-toolbar flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleGoHome}
                className="text-xs font-black text-[#881337] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {lang === 'am' || lang === 'har'
                    ? 'ወደ መነሻ ገጽ ተመለስ'
                    : lang === 'om'
                    ? 'Gara Jalqabaatti Deebi’i'
                    : 'Back to Home'}
                </span>
              </button>
              <span className="text-[10px] font-bold text-[#9D174D] uppercase tracking-wider bg-[#FFE4E6] px-2.5 py-0.5 rounded-full">
                {lang === 'am' || lang === 'har' ? 'አደገኛ ምልክቶች' : lang === 'om' ? 'Mallattoolee Balaa' : 'Danger Signs'}
              </span>
            </div>

            <DangerSignsSystem
              lang={lang}
              initialMode={dangerSignsInitialMode}
              onGoHome={handleGoHome}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
            />
          </div>
        ) : activeCategory === 'postpartum_care' ? (
          <div className="mc-page-screen space-y-4">
            <PostpartumCare
              lang={lang}
              onGoHome={handleGoHome}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
            />
          </div>
        ) : activeCategory === 'substance_use' ? (
          <div className="mc-page-screen space-y-4">
            <SubstanceUseSupport
              lang={lang}
              onGoHome={handleGoHome}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
            />
          </div>
        ) : activeCategory === 'about' ? (
          <div className="mc-page-screen space-y-4">
            <div className="mc-about-page rounded-[28px] border border-[#E9D5DD] bg-white shadow-sm overflow-hidden">
              <div className="mc-about-hero bg-[#6E1E3A] px-5 py-7 text-white text-center">
                <div className="mx-auto w-full max-w-[300px] rounded-2xl bg-white px-3 py-2 shadow-lg">
                  <img
                    src={`${import.meta.env.BASE_URL}mela-lockup.png`}
                    alt="Mela Care"
                    className="mx-auto h-24 w-full rounded-xl object-contain bg-[#08091A]"
                  />
                </div>
                <p className="mt-2 text-sm text-[#F6D3E0]">
                  {lang === 'am' || lang === 'har'
                    ? 'የእናቶች፣ የስነ-ተዋልዶ እና የቤተሰብ ጤና መሣሪያ'
                    : lang === 'om'
                    ? 'Meeshaa fayyaa haadholii, dhalootaa fi karoora maatii'
                    : 'Maternal, reproductive and family-care support'}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <section className="rounded-2xl border border-[#E9D5DD] bg-[#FFF9FB] p-4">
                  <h2 className="text-base font-black text-[#6E1E3A]">
                    {lang === 'am' || lang === 'har' ? 'Mela Care እንዴት ይጠቀሙት?' : lang === 'om' ? 'Mela Care akkamittin fayyadaman?' : 'How to use Mela Care'}
                  </h2>
                  <ol className="mt-3 grid gap-2 text-sm text-slate-700">
                    <li><strong>1.</strong> {lang === 'om' ? 'Ulfaa, ultruffa dhabamuu ykn dhalachuu booda filadhaa.' : lang === 'am' || lang === 'har' ? 'እርግዝና፣ እርጉዝ ያልሆኑ ወይም ድህረ ወለድ ሁኔታዎን ይምረጡ።' : 'Choose not pregnant, pregnant or postpartum.'}</li>
                    <li><strong>2.</strong> {lang === 'om' ? 'Mallattoolee balaa ykn meeshaalee barbaachisan banadhaa.' : lang === 'am' || lang === 'har' ? 'ምልክቶችን አነጋግርዎት ወይም የቤተሰብ ምጣኔ መሣሪያዎችን ይክፈቱ።' : 'Open a warning-sign guide or care tool.'}</li>
                    <li><strong>3.</strong> {lang === 'om' ? 'Tajaajila haala qabeessa yoo barbaaddan buufata fayyaa ykn 907 fayyadamaa.' : lang === 'am' || lang === 'har' ? 'ለአስቸኳይ ጥገና 907 ይደውሉ ወይም ጤና ጣቢያ ይፈልጉ።' : 'Use the SOS action or facility directory for urgent help.'}</li>
                  </ol>
                </section>
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#F8F1F4] p-4 text-center"><ShieldCheck className="mx-auto h-6 w-6 text-[#6E1E3A]" /><strong className="mt-2 block text-sm">{lang === 'om' ? 'Dhuunfaa' : 'Private'}</strong><span className="mt-1 block text-xs text-slate-600">{lang === 'om' ? 'Meeshaaleen maalii bilbila keessan irratti.' : lang === 'am' ? 'መረጃዎ በመሳሪያዎ ላይ ይቆያል' : 'Care information stays on your device'}</span></div>
                  <div className="rounded-2xl bg-[#EDF5F1] p-4 text-center"><WifiOff className="mx-auto h-6 w-6 text-[#1F6B45]" /><strong className="mt-2 block text-sm">Offline-ready</strong><span className="mt-1 block text-xs text-slate-600">{lang === 'om' ? 'Interneetii malee fayyadamuu danda’a.' : lang === 'am' ? 'ኢንተርኔት ሳይሆን ጥቅም ላይ መዋል ይችላል' : 'Key tools can work without internet'}</span></div>
                  <div className="rounded-2xl bg-[#F8F1F4] p-4 text-center"><Code2 className="mx-auto h-6 w-6 text-[#6E1E3A]" /><strong className="mt-2 block text-sm">{lang === 'om' ? 'Misoomaa' : lang === 'am' ? 'ገንቢ' : 'Developer'}</strong><span className="mt-1 block text-xs text-slate-600">ha21ab</span></div>
                </section>
                <p className="rounded-xl border border-[#F2D8E1] px-4 py-3 text-xs leading-relaxed text-slate-600">
                  {lang === 'am' || lang === 'har'
                    ? 'Mela Care ሕክምና ለመተካት አይደለም። አደገኛ ምልክቶች የሚታዩበት ጊዜ አካባቢዎት ያለ የጤና ባለሙያ ይጠይቁ።'
                    : lang === 'om'
                    ? 'Mela Care bakka ogeessa fayyaa buusu miti. Mallattooleen balaa yeroon mul’atan ogeessa fayyaa naannoo kee gaafadhu.'
                    : 'Mela Care does not replace professional medical care. For danger signs or urgent symptoms, contact a nearby health worker or emergency service.'}
                </p>
                <p className="rounded-xl bg-[#F8F1F4] px-4 py-3 text-xs leading-relaxed text-slate-700">
                  {lang === 'am' || lang === 'har'
                    ? 'ለቀጥታ መገናኘት ከሚያገኙት የMela Care Telegram bot ቻት ይጠቀሙ።'
                    : lang === 'om'
                    ? 'Quunnamtii kallattii argachuuf chat Telegram bot Mela Care waliin fayyadamaa.'
                    : 'For direct contact, you can use the associated Mela Care Telegram bot chat.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* FOCUSED VIEW 2: FAMILY PLANNING & CONTRACEPTIVE SYSTEM */
          <div className="mc-page-screen space-y-4">
            <div className="mc-page-toolbar flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleGoHome}
                className="text-xs font-black text-[#881337] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {lang === 'am' || lang === 'har'
                    ? 'ወደ መነሻ ገጽ ተመለስ'
                    : lang === 'om'
                    ? 'Gara Jalqabaatti Deebi’i'
                    : 'Back to Home'}
                </span>
              </button>
              <span className="text-[10px] font-bold text-[#9D174D] uppercase tracking-wider bg-[#FFE4E6] px-2.5 py-0.5 rounded-full">
                {lang === 'am' || lang === 'har' ? 'የቤተሰብ ምጣኔ' : lang === 'om' ? 'Karoora Maatii' : 'Family Planning'}
              </span>
            </div>

            <FamilyPlanningSystem
              lang={lang}
              onGoHome={handleGoHome}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Bottom sticky navigation */}
      <footer className="mc-bottom-nav sticky bottom-0 z-30 bg-white border-t border-slate-200 px-3 py-2 shadow-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleGoHome}
            aria-current={activeCategory === null ? 'page' : undefined}
            className={`min-h-12 flex flex-col items-center justify-center rounded-xl text-xs font-bold ${
              activeCategory === null
                ? 'bg-[#6E1E3A] text-white'
                : 'text-slate-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">
              {lang === 'am' ? 'መነሻ' : lang === 'om' ? 'Jalqaba' : 'Home'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectCategory('substance_use')}
            className={`min-h-12 flex flex-col items-center justify-center rounded-xl text-xs font-bold ${
              activeCategory === 'substance_use'
                ? 'bg-[#E9F5F1] text-[#0F766E]'
                : 'text-slate-700'
            }`}
          >
            <Leaf className="w-5 h-5 text-[#1F6B45]" />
            <span className="mt-0.5 text-center">{lang === 'am' || lang === 'har' ? 'የሱስ እገዛ' : lang === 'om' ? 'Mirkaneessaa' : 'Substance'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDirectoryOpen(true)}
            className={`min-h-12 flex flex-col items-center justify-center rounded-xl text-xs font-bold ${
              isDirectoryOpen ? 'bg-[#EEF2F7] text-[#334B68]' : 'text-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5 text-[#334B68]" />
            <span className="text-[10px] mt-0.5">
              {lang === 'am' || lang === 'har' ? 'ጤና ጣቢያ' : lang === 'om' ? 'Buufata' : 'Facilities'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectCategory('about')}
            aria-current={activeCategory === 'about' ? 'page' : undefined}
            className={`min-h-12 flex flex-col items-center justify-center rounded-xl text-xs font-bold ${
              activeCategory === 'about'
                ? 'bg-[#6E1E3A] text-white'
                : 'text-slate-700'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">
              {lang === 'am' || lang === 'har' ? 'ስለ መተግበሪያው' : lang === 'om' ? 'Waa’ee' : 'About'}
            </span>
          </button>
        </div>
      </footer>

      {/* Emergency Flashcard Modal */}
      {isBeaconOpen && (
        <MedicalBeacon lang={lang} onClose={() => setIsBeaconOpen(false)} />
      )}

      {/* Hospital & Health Center Directory Modal */}
      <FacilityDirectory
        lang={lang}
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
    </div>
  );
}

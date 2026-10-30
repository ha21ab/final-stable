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
import { audioEngine } from './utils/audio';
import { initTelegramMiniApp, setupTelegramBackButton, isTelegramMiniApp } from './utils/telegram';
import {
  ArrowLeft,
  AlertCircle,
  Home,
  Volume2,
  VolumeX,
  PhoneCall,
  Shield,
  Heart,
  EyeOff,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<AppLanguage>('am');
  const [activeCategory, setActiveCategory] = useState<ActiveServiceCategory>(null);
  const [isBeaconOpen, setIsBeaconOpen] = useState<boolean>(false);
  const [isMaskOpen, setIsMaskOpen] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [dangerSignsInitialMode, setDangerSignsInitialMode] = useState<
    'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test'
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
  };

  const handleSelectCategory = (
    category: ActiveServiceCategory,
    initialMode?: 'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test'
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
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A0420] flex flex-col font-sans selection:bg-[#FFE4E6]">
      {/* Discreet Mask Disguise (Toggled in emergency on shared phone) */}
      <DiscreetMask
        isOpen={isMaskOpen}
        onExit={() => setIsMaskOpen(false)}
        lang={lang}
      />

      {/* Top Persistent App Crown */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#881337] to-[#4A0420] text-white px-3 sm:px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
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
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#E11D48] text-white flex items-center justify-center font-black text-base shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight block leading-tight">
                {lang === 'am' || lang === 'har' ? 'መላ ኬር' : 'Mela Care'}
              </span>
              <span className="text-[10px] text-rose-200 block leading-tight font-medium">
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
          <PWAInstallButton lang={lang} variant="header" />

          {/* Quick Privacy Disguise Shield */}
          <button
            type="button"
            onClick={() => setIsMaskOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            title={lang === 'am' || lang === 'har' ? 'የሚስጥር መሸፈኛ' : lang === 'om' ? 'Haguuggi Iccitii' : 'Discreet Mask'}
            aria-label="Discreet disguise screen"
          >
            <EyeOff className="w-4 h-4 text-rose-200" />
          </button>

          {/* Health Centers Directory Trigger */}
          <button
            type="button"
            onClick={() => setIsDirectoryOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            title={lang === 'am' || lang === 'har' ? 'የሆስፒታሎች ማውጫ' : lang === 'om' ? 'Galmee Hospitaalotaa' : 'Hospitals Directory'}
            aria-label="Hospital Directory"
          >
            <Building2 className="w-4 h-4 text-rose-200" />
          </button>

          {/* Quick 907 Ambulance link */}
          <a
            href="tel:907"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            title="National Ambulance Service Toll-Free"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>907</span>
          </a>

          {/* SOS Beacon Modal Trigger */}
          <button
            type="button"
            onClick={handleEmergencyTrigger}
            className="px-3 py-1.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-black text-xs flex items-center gap-1 shadow-xs"
            aria-label="Emergency SOS flashcard"
          >
            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
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
            onEmergencyTrigger={handleEmergencyTrigger}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
          />
        ) : activeCategory === 'danger_signs' ? (
          /* FOCUSED VIEW 1: PREGNANCY DANGER SIGNS & EMERGENCY SYSTEM */
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
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
        ) : (
          /* FOCUSED VIEW 2: FAMILY PLANNING & CONTRACEPTIVE SYSTEM */
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
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

      {/* Bottom Sticky Sisterhood Bar */}
      <footer className="sticky bottom-0 z-30 bg-[#FFF0F3] border-t border-[#FBCFE8] px-4 py-2.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Home Button */}
          <button
            type="button"
            onClick={handleGoHome}
            className={`flex flex-col items-center justify-center p-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === null
                ? 'text-[#881337]'
                : 'text-[#783A4E] hover:text-[#4A0420]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">
              {lang === 'am' ? 'መነሻ' : lang === 'om' ? 'Jalqaba' : 'Home'}
            </span>
          </button>

          {/* Voice Companion Indicator / Control */}
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) {
                audioEngine.stop();
              } else {
                audioEngine.play(
                  lang === 'am'
                    ? 'መላ ኬር ለእርስዎ እና ለልጅዎ ጤና የተዘጋጀ ነው። የእርግዝና አደገኛ ምልክቶችን ወይም የቤተሰብ ምጣኔን ይጫኑ።'
                    : 'Mela Care is here for maternal health, danger sign recognition, and family planning.',
                  'CALM_GUIDE',
                  lang
                );
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 max-w-[55%] overflow-hidden ${
              isPlayingAudio
                ? 'bg-[#FFE4E6] text-[#881337] border border-[#881337]'
                : 'bg-white border border-[#FBCFE8] text-[#881337] hover:bg-[#FFF5F7]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span className="truncate">{lang === 'am' || lang === 'har' ? 'አቁም' : lang === 'om' ? 'Dhaabi' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#881337] shrink-0" />
                <span className="truncate">
                  {lang === 'am' || lang === 'har' ? 'ድምፅ አጫውት' : lang === 'om' ? 'Sagalee' : 'Listen Voice'}
                </span>
              </>
            )}
          </button>

          {/* Persistent Quick SOS Flashcard */}
          <button
            type="button"
            onClick={handleEmergencyTrigger}
            className="flex flex-col items-center justify-center p-1 rounded-xl text-xs font-black text-[#DC2626] active:scale-95"
          >
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] mt-0.5">
              {lang === 'am' || lang === 'har' ? 'አደጋ 907' : lang === 'om' ? 'Balaa 907' : 'SOS 907'}
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

import React, { useState } from 'react';
import { Download, Share, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { isTelegramMiniApp, triggerHaptic } from '../utils/telegram';
import { AppLanguage } from '../types';

interface PWAInstallButtonProps {
  lang: AppLanguage;
  variant?: 'header' | 'banner' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  variant = 'pill',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isTMA = isTelegramMiniApp();

  // If already installed as standalone PWA or running natively inside Telegram
  if (isInstalled || isTMA) {
    if (variant === 'header') return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>
          {isTMA
            ? 'Telegram Mini App'
            : lang === 'am' || lang === 'har'
            ? 'መተግበሪያው ተጭኗል'
            : lang === 'om'
            ? 'Appiin Fe’ameera'
            : 'App Installed'}
        </span>
      </div>
    );
  }

  const handleInstallClick = () => {
    triggerHaptic('medium');
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In case beforeinstallprompt hasn't fired yet or browser unsupported
      setShowIOSGuide(true);
    }
  };

  const getButtonLabel = () => {
    if (lang === 'am' || lang === 'har') return 'መተግበሪያውን ጫን';
    if (lang === 'om') return 'Appii Fe’aa';
    return 'Install App';
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Install Mela Care as Progressive Web App"
        className={`flex items-center gap-1.5 font-bold transition-all active:scale-95 shadow-xs cursor-pointer ${
          variant === 'header'
            ? 'px-3 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs border border-white/30 backdrop-blur-xs'
            : variant === 'banner'
            ? 'w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#881337] to-[#DC2626] text-white text-xs sm:text-sm justify-center shadow-md hover:opacity-95'
            : 'px-3.5 py-2 rounded-2xl bg-white border border-[#FBCFE8] hover:border-[#881337] text-[#881337] text-xs'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{getButtonLabel()}</span>
      </button>

      {/* Manual Installation Guide Modal (iOS Safari & non-Chromium browsers) */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 sm:p-6 shadow-2xl border-2 border-[#FBCFE8] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#881337] font-black text-base">
                <Smartphone className="w-5 h-5 text-[#E11D48]" />
                <span>
                  {lang === 'am' || lang === 'har'
                    ? 'በስልክዎ ላይ ይጫኑ'
                    : lang === 'om'
                    ? 'Bilbila Keessan Irratti Fe’aa'
                    : 'Install On Your Phone'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#881337] flex items-center justify-center hover:bg-[#FFE4E6]"
                aria-label="Close installation guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#783A4E] leading-relaxed">
              {lang === 'am' || lang === 'har'
                ? 'መላ ኬር ያለ ኢንተርኔት (ኦፍላይን) እንዲሰራ እና እንደ ቋሚ መተግበሪያ ለመጠቀም፦'
                : lang === 'om'
                ? 'Mela Care interneetii malee akka hojjetuuf bilbila keessan irratti fe’adhaa:'
                : 'Install Mela Care to use it 100% offline and launch directly from your home screen:'}
            </p>

            <div className="bg-[#FFF5F7] p-3.5 rounded-2xl border border-[#FBCFE8] space-y-2 text-xs font-medium text-[#4A0420]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  {lang === 'am' || lang === 'har' ? (
                    <>በብሮውዘሩ ታች ያለውን የ<strong>ማጋራት (Share)</strong> ምልክት <Share className="w-3.5 h-3.5 inline mx-1 text-[#881337]" /> ይጫኑ።</>
                  ) : lang === 'om' ? (
                    <>Mallattoo <strong>Share</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-[#881337]" /> tuqaa.</>
                  ) : (
                    <>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-[#881337]" /> in your browser toolbar.</>
                  )}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  {lang === 'am' || lang === 'har' ? (
                    <>ወደ ታች ዝቅ ብለው <strong>«ወደ መነሻ ስክሪን ጨምር» (Add to Home Screen)</strong> የሚለውን ይምረጡ።</>
                  ) : lang === 'om' ? (
                    <>Gadi siqsuun <strong>«Add to Home Screen»</strong> filadhaa.</>
                  ) : (
                    <>Scroll down and tap <strong>"Add to Home Screen"</strong>.</>
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#881337] text-white font-bold text-xs hover:bg-[#701A75] active:scale-95 transition-all shadow-xs"
            >
              {lang === 'am' || lang === 'har' ? 'ገባኝ / ዝጋ' : lang === 'om' ? 'Galeera / Cufi' : 'Got it / Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

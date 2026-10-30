import React from 'react';
import { X, Volume2, ShieldAlert, PhoneCall, AlertCircle, MessageSquare } from 'lucide-react';
import { AppLanguage, DangerSign } from '../types';
import { audioEngine } from '../utils/audio';
import { resolveText } from '../utils/compass';
import maternalPreeclampsiaImg from '../assets/images/maternal_preeclampsia_guide_1793105782753.jpg';
import maternalHemorrhageImg from '../assets/images/maternal_hemorrhage_urgent_1793105783358.jpg';

interface MedicalBeaconProps {
  lang: AppLanguage;
  selectedDangerSign?: DangerSign | null;
  customSign?: DangerSign | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const MedicalBeacon: React.FC<MedicalBeaconProps> = ({
  lang,
  selectedDangerSign,
  customSign,
  isOpen = true,
  onClose,
}) => {
  const activeSign = customSign || selectedDangerSign;
  if (isOpen === false) return null;
  const readAloud = () => {
    const text =
      lang === 'am'
        ? 'እኔ ነፍሰጡር ነኝ። አስቸኳይ የጤና አደጋ ገጥሞኛል። እባክዎ አሁኑኑ ወደ ቅርብ ሆስፒታል ወይም ጤና ጣቢያ ይውሰዱኝ።'
        : lang === 'om'
        ? 'Ani ulfaadha. Balaa fayyaa cimaatu na mudate. Mee battalumatti gara hospitaala dhiyaatutti na geessaa.'
        : 'I am pregnant and in critical danger. Please transport me to the nearest emergency hospital or health center immediately.';
    audioEngine.play(text, 'URGENT_CALM', lang);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="beacon-title"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-[#DC2626] shadow-2xl overflow-hidden flex flex-col">
        {/* Emergency Beacon Red Header */}
        <div className="bg-[#DC2626] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#DC2626] flex items-center justify-center font-black text-2xl shadow-xs">
              +
            </div>
            <div>
              <div
                id="beacon-title"
                className="font-black text-sm sm:text-base tracking-wide flex items-center gap-1.5"
              >
                <span>
                  {lang === 'am'
                    ? 'የአስቸኳይ ጊዜ ህክምና ካርድ'
                    : lang === 'om'
                    ? 'Kaardii Yaala Hatattamaa'
                    : lang === 'har'
                    ? 'የአስቸኳይ ጊዜ ህክምና ካርድ'
                    : 'EMERGENCY CLINICAL FLASHCARD'}
                </span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <div className="text-[11px] text-white/90">
                {lang === 'am'
                  ? 'ይህንን ስክሪን ለአምቡላንስ ሹፌር ወይም ለሀኪም ያሳዩ'
                  : lang === 'om'
                  ? 'Iskiriinii kana shofeeraa ykn ogeessa fayyaatti agarsiisaa'
                  : 'Show this screen to driver, nurse, or midwife immediately'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Context Illustration */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden border-b-2 border-[#DC2626]">
          <img
            src={
              activeSign?.bodyZone === 'head_eyes' || activeSign?.bodyZone === 'face_hands'
                ? maternalPreeclampsiaImg
                : maternalHemorrhageImg
            }
            alt="Maternal Emergency Visual Cue"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-2.5 left-4 right-4 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-300 block">
                {lang === 'am'
                  ? 'አስቸኳይ የህክምና ትራንስፖርት ያስፈልጋል'
                  : lang === 'om'
                  ? 'Gara Hospitaalaa Geessuun Barbaachisaadha'
                  : 'Immediate Clinical Transport Needed'}
              </span>
              <span className="text-xs font-bold leading-tight block">
                {activeSign ? resolveText(activeSign.title, lang) : (lang === 'am' ? 'የእርግዝና አስቸኳይ አደጋ' : lang === 'om' ? 'Balaa Cimaa Ulfaa' : 'Maternal Obstetric Emergency')}
              </span>
            </div>
            <span className="w-3 h-3 rounded-full bg-[#DC2626] border-2 border-white animate-ping" />
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-5 bg-[#FFF5F7] space-y-3.5 text-left max-h-[50vh] overflow-y-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-[#991B1B] text-xs font-bold border border-red-200">
            <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
            <span>
              {lang === 'am'
                ? 'ስልኩን በቀጥታ ለሹፌሩ ወይም ለሀኪሙ ያሳዩ'
                : lang === 'om'
                ? 'Bilbila kana ogeessa ykn shofeeraatti agarsiisaa'
                : 'Hand directly to driver, midwife or triage nurse'}
            </span>
          </div>

          <div className="border-l-4 border-[#DC2626] pl-4 py-1 space-y-3 bg-white p-3.5 rounded-r-2xl border-y border-r border-[#FBCFE8]">
            <h2 className="text-xl sm:text-2xl font-black text-[#4A0420] leading-snug">
              {lang === 'am'
                ? '«እኔ ነፍሰጡር ነኝ፤ አስቸኳይ የጤና አደጋ ገጥሞኛል!»'
                : lang === 'om'
                ? '«Ani ulfaadha; balaa fayyaa cimaatu na mudate!»'
                : '“I am pregnant and experiencing a maternal emergency!”'}
            </h2>

            {activeSign ? (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                  {lang === 'am' ? 'የታየው አደገኛ ምልክት' : lang === 'om' ? 'Mallattoo Balaa Mul’ate' : 'Reported Danger Sign'}:
                </span>
                <p className="text-base sm:text-lg font-bold text-[#DC2626]">
                  {resolveText(activeSign.title, lang)}
                </p>
                <p className="text-xs text-[#4A0420] mt-1">
                  {resolveText(activeSign.actionInstruction, lang)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-bold text-[#DC2626]">
                {lang === 'am'
                  ? '«ከባድ ደም መፍሰስ፣ ኃይለኛ ቁርጠት፣ ማንቀጥቀጥ ወይም ድንገተኛ የእርግዝና አደጋ አለብኝ።»'
                  : lang === 'om'
                  ? '«Dhiigni dhangala’uu, dhukkubbii cimaa, hollannaa ykn balaa ulfaa qaba.»'
                  : '“I have severe bleeding, extreme pain, convulsions or obstetric crisis.”'}
              </p>
            )}

            <p className="text-base sm:text-lg font-bold text-[#881337]">
              {lang === 'am'
                ? '«እባክዎ አሁኑኑ ወደ ቅርብ ሆስፒታል ወይም ጤና ጣቢያ ውሰዱኝ።»'
                : lang === 'om'
                ? '«Mee battalumatti gara hospitaala dhiyaatutti na geessaa.»'
                : '“Please transport me to the nearest emergency hospital immediately.”'}
            </p>
          </div>

          {/* Master Amharic Clinical Reference for Ethiopia Clinic Staff */}
          {lang !== 'am' && (
            <div className="bg-[#FFE4E6] p-3 rounded-2xl border border-[#FBCFE8] text-xs text-[#4A0420]">
              <span className="font-bold text-[10px] text-[#9D174D] uppercase tracking-wider block mb-1">
                {lang === 'om' ? 'Ogeessa Fayyaa Itoophiyaatiif (Afaan Amaaraa):' : 'For Ethiopian Clinical Staff (Amharic):'}
              </span>
              <p className="font-semibold text-sm">
                «እኔ ነፍሰጡር ነኝ። አስቸኳይ የፅንስ ወይም የእርግዝና አደጋ ገጥሞኛል። እባክዎ በአፋጣኝ ወደ ድንገተኛ ክፍል ወይም ሆስፒታል አድርሱኝ።»
              </p>
            </div>
          )}

          {/* Quick Emergency Hotlines: Call 907, Call 952 & Send Dispatch SMS */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:907"
                className="py-2.5 px-3 rounded-2xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {lang === 'am' ? '907 አምቡላንስ' : lang === 'om' ? '907 Ambulaansii' : 'Call 907'}
                </span>
              </a>
              <a
                href="tel:952"
                className="py-2.5 px-3 rounded-2xl bg-[#881337] hover:bg-[#701A75] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {lang === 'am' ? '952 ጤና ጥበቃ' : lang === 'om' ? '952 Ministeera Fayyaa' : 'Call 952'}
                </span>
              </a>
            </div>

            {/* Direct SMS Dispatch Template */}
            <a
              href={`sms:907?body=${encodeURIComponent(
                lang === 'am' || lang === 'har'
                  ? `አስቸኳይ፦ ነፍሰጡር እናት ድንገተኛ የእርግዝና አደጋ ገጥሟታል። ምልክት፦ ${activeSign ? resolveText(activeSign.title, lang) : 'ከፍተኛ አደጋ'}። እባክዎ በአፋጣኝ 907 አምቡላንስ ይላኩልን።`
                  : lang === 'om'
                  ? `HATATTAMA: Haati ulfaa balaa cimaa keessa jirti. Mallattoo: ${activeSign ? resolveText(activeSign.title, lang) : 'Balaa Cimaa'}. Mee battalumatti ambulaansii 907 nuuf ergaa.`
                  : `EMERGENCY: Pregnant mother in acute obstetric distress. Danger: ${activeSign ? resolveText(activeSign.title, lang) : 'Critical emergency'}. Please dispatch 907 ambulance immediately.`
              )}`}
              className="w-full py-2.5 px-3 rounded-2xl bg-white border border-red-300 hover:bg-red-50 text-[#DC2626] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'am' || lang === 'har'
                  ? 'የአደጋ ጊዜ 907 SMS መልዕክት ላክ'
                  : lang === 'om'
                  ? 'Ergaa SMS 907 Hatattamaa Ergaa'
                  : 'Send Emergency 907 Dispatch SMS'}
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FFF0F3] px-5 py-3 border-t border-[#FBCFE8] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={readAloud}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-white border border-[#FBCFE8] text-[#881337] font-bold text-xs hover:bg-[#FFE4E6] active:scale-95 transition-all shadow-2xs shrink-0 max-w-[60%] overflow-hidden"
          >
            <Volume2 className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span className="truncate">
              {lang === 'am' || lang === 'har' ? 'በድምፅ አንብብ' : lang === 'om' ? 'Sagaleen Dubbisi' : 'Read Aloud'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#881337] text-white font-bold text-xs hover:bg-[#701A75] active:scale-95 transition-all shadow-xs"
          >
            <span>{lang === 'am' ? 'ዝጋ' : lang === 'om' ? 'Cufi' : lang === 'har' ? 'ዝጋ' : 'Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
